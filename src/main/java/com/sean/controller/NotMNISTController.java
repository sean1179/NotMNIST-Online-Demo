package com.sean.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.sean.service.NoMnistService;
import com.sean.util.DateUtil;

@MultipartConfig
@WebServlet("/notmnist")
public class NotMNISTController extends HttpServlet{
	
	private static final long serialVersionUID = 4792719715871866051L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String filedir = req.getSession().getServletContext().getRealPath("/")+"img\\";
		String imgname = DateUtil.DateToTimeStamp(new Date())+".png";
		String modeldir = req.getSession().getServletContext().getRealPath("")+"\\WEB-INF\\classes";
		PrintWriter out = resp.getWriter();
		Part p= req.getPart("notmnistimg");
		
		if(p.getContentType().contains("image")||p.getContentType().contains("application")){
			NoMnistService service = new NoMnistService();
            p.write(filedir+imgname);
            out.write(service.guessImg(modeldir,filedir+imgname));
        }else {
        	out.write("{\"message\":\"啊呀！我猜不出来(╯￣Д￣)╯╘═╛,请帮我喊下Sean修复,拜托了_(:3」∠)_。错误代码:001\"}");
        }
		out.close();
	}
}
