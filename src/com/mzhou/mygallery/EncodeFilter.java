package com.mzhou.mygallery;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class EncodeFilter implements Filter {

	private String encoding;

	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
       HttpServletRequest request = (HttpServletRequest)req;
       HttpServletResponse response = (HttpServletResponse)res;

       request.setCharacterEncoding(this.encoding);
       response.setCharacterEncoding(this.encoding);
       // for cross origin
       response.setHeader("Access-Control-Allow-Headers", "origin, x-requested-with, x-file-name, content-type, cache-control");
       response.setHeader("Access-Control-Request-Method", "POST");
       response.setHeader("Access-Control-Allow-Origin", "*");

       chain.doFilter(req, res);
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
        this.encoding = config.getInitParameter("encoding"); 
	}

}
