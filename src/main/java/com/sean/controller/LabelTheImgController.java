package com.sean.controller;

import java.io.IOException;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import com.sean.util.DateUtil;

@MultipartConfig
@WebServlet("/labelnotmnist")
public class LabelTheImgController extends HttpServlet{
	
	private static final long serialVersionUID = 6329219117642590704L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String filedir = req.getSession().getServletContext().getRealPath("/")+"img\\";
		String imgname = DateUtil.DateToTimeStamp(new Date())+".png";
		String answer = req.getParameter("answer");
		if( !"".equals(answer) && answer != null) {
			filedir = filedir+answer+"\\";
			imgname = answer+'-'+imgname;
		}
		System.out.println(filedir+imgname);
		Part p= req.getPart("notmnistimg");
		if(p.getContentType().contains("image")||p.getContentType().contains("application")){
            p.write(filedir+imgname);
        }
	}
}
