package com.mzhou.mygallery;

import java.io.IOException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Transaction;

@SuppressWarnings("serial")
public class Pictures extends HttpServlet {
	
    private static final Logger log = Logger.getLogger(Pictures.class.getName());
	private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
	private String getPicUrl = "/api/pic/?blob-key=";
	private String uploadPicUrl = "/api/pic/";

    public void doDelete(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
    	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    	String id = req.getParameter("id");
		res.setContentType("text/plain");

    	if (id != null) {
        	Transaction txn = datastore.beginTransaction();
    		Long lId = Long.parseLong(id);
    		Key key = KeyFactory.createKey("Picture", lId);
    		datastore.delete(key);
    		txn.commit();
    		res.getWriter().print("OK");
    	} else {
    		res.getWriter().print("ERROR");
    	}
    }
    
    
	public void doGet(HttpServletRequest req, HttpServletResponse res)
        throws ServletException, IOException {
		// get one picture
		// 	params: blob-key, height
		String key = req.getParameter("blob-key");
		if (key != null) {
			BlobKey blobKey = new BlobKey(key);
			blobstoreService.serve(blobKey, res);
		} else {
			doGetPicList(req, res);
		}
    }
	
	public void doGetPicList(HttpServletRequest req, HttpServletResponse res) throws IOException {
		// get picture data list
		// 	params: cursor, pageSize
    	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Query q = new Query("Picture");
        q.addSort("uploadTime", SortDirection.DESCENDING);
        PreparedQuery pq = datastore.prepare(q);
		
        res.setContentType("text/plain");

        String pageSizeStr = req.getParameter("pageSize");
        int pageSize;
        if (pageSizeStr != null) {
        	pageSize =Integer.parseInt(pageSizeStr);
        } else {
        	pageSize = 10;
        }
        
        FetchOptions fetchOptions = FetchOptions.Builder.withLimit(pageSize);
        String startCursor = req.getParameter("cursor");

        if (startCursor != null) {
            fetchOptions.startCursor(Cursor.fromWebSafeString(startCursor));
            log.info("Fetch pics from " + startCursor + ".");
        } else {
            log.info("Fetch pics.");
        }
        
        try {
            QueryResultList<Entity> results = pq.asQueryResultList(fetchOptions);
			SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd kk-mm");
	        JSONArray pics = new JSONArray();
	        JSONObject pic;
	        
	        for (Entity entity : results) {
	        	pic = new JSONObject();
	        	pic.put("id", String.valueOf(entity.getKey().getId()));
				pic.put("url", getPicUrl + entity.getProperty("key"));
	            pic.put("fileName", entity.getProperty("fileName"));
	            pic.put("uploadTime", f.format(entity.getProperty("uploadTime")));
	            pics.put(pic);
	        }
	        
            JSONObject re = new JSONObject();
            re.put("pics", pics);
			re.put("cursor", results.getCursor().toWebSafeString());
			
			res.getWriter().print(re);
		} catch (JSONException e) {
			e.printStackTrace();
			res.getWriter().print("{error: 1, msg: \"Fetch pics error.\"}");
		}
	}
	

    @SuppressWarnings("deprecation")
	public void doPost(HttpServletRequest req, HttpServletResponse res)
        throws ServletException, IOException {

        Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);
        BlobKey blobKey = blobs.get("fileUploader");
        
        // noscript
        String noscript = req.getParameter("noscript");
        Boolean isNoScript;
        if (noscript != null) {
        	isNoScript = noscript.equals("true");
        } else {
        	isNoScript = false;
        }
        // file name
        String fileName = req.getParameter("filename");
        if (fileName != null) {
        	fileName = URLDecoder.decode(fileName, "utf-8");
        }
        // upload time
        Date uploadTime = new Date();
        // result
        Map<String, Object> re;

        // log
        log.info("Upload image:" + 
        		fileName + 
        		" at " + 
        		uploadTime.toGMTString() + 
        		(isNoScript ? "" : " with javascript"));

        if (blobKey == null) {
        	if (isNoScript) {
        		res.sendRedirect("/");
        	} else {
        		re = new HashMap<String, Object>();
        		re.put("error", 2);
        		re.put("msg", "No picture uploaded!");
        		JSONObject jsonObject = new JSONObject( re );
        		res.setContentType("text/plain");
        		res.getWriter().print(jsonObject);
        	}
        } else {
        	String key = blobKey.getKeyString();
        	
        	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        	Transaction txn = datastore.beginTransaction();
            Entity e = new Entity("Picture");
            e.setProperty("key", key);
            e.setProperty("fileName", fileName);
            e.setProperty("uploadTime", uploadTime);
            datastore.put(e);
            txn.commit();

        	if (isNoScript) {
            	res.sendRedirect("/m/");
        	} else {
        		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd kk-mm");
        		BlobstoreService bs = BlobstoreServiceFactory.getBlobstoreService();
        		re = new HashMap<String, Object>();
	        	re.put("id", String.valueOf(e.getKey().getId()));
        		re.put("url", getPicUrl + key);
        		re.put("fileName", fileName);
        		re.put("uploadTime", f.format(uploadTime));
    			re.put("newUploadUrl", bs.createUploadUrl(uploadPicUrl));
        		JSONObject jsonObject = new JSONObject( re );
        		res.setContentType("text/plain");
        		res.getWriter().print(jsonObject);
        	}
        }
    }
}
