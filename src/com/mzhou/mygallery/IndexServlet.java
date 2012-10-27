package com.mzhou.mygallery;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

@SuppressWarnings("serial")
public class IndexServlet extends HttpServlet {

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		BlobstoreService bs = BlobstoreServiceFactory.getBlobstoreService();
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("uploadUrl", bs.createUploadUrl("/api/pic/"));
		req.setAttribute("model", model);
		boolean debug = System.getProperty("com.google.appengine.runtime.environment") == "Development";
		req.setAttribute("debug", debug);
		RequestDispatcher dispatcher = req.getRequestDispatcher("/jsp/indexServlet.jsp");
		try {
			dispatcher.forward(req, resp);
		} catch (ServletException e) {
			e.printStackTrace();
		}
	}

}
