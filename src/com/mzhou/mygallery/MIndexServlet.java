package com.mzhou.mygallery;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Query.SortDirection;

@SuppressWarnings("serial")
public class MIndexServlet extends HttpServlet {

    private static final Logger log = Logger.getLogger(MIndexServlet.class.getName());
    
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException  {
		BlobstoreService bs = BlobstoreServiceFactory.getBlobstoreService();
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("uploadUrl", bs.createUploadUrl("/api/pic/"));
		
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
			ArrayList<HashMap<String, String>> pics = new ArrayList<HashMap<String, String>>();
	        HashMap<String, String> pic;
	        
	        for (Entity entity : results) {
	        	pic = new HashMap<String, String>();
	        	pic.put("id", String.valueOf(entity.getKey().getId()));
				pic.put("url", "/api/pic/?blob-key=" + entity.getProperty("key"));
	            pic.put("fileName", (String) entity.getProperty("fileName"));
	            pic.put("uploadTime", f.format(entity.getProperty("uploadTime")));
	            pics.add(pic);
	        }
	        
	        model.put("pics", pics);
	        model.put("cursor", results.getCursor().toWebSafeString());

			req.setAttribute("model", model);
			RequestDispatcher dispatcher = req.getRequestDispatcher("/jsp/mIndexServlet.jsp");
			dispatcher.forward(req, res);
			
		} catch (ServletException e) {
			e.printStackTrace();
		}
	}
	
}
