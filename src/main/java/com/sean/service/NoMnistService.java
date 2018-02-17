package com.sean.service;

import java.text.DecimalFormat;

import com.sean.nomnist.NoMnistModel;

public class NoMnistService {
	
	public String guessImg(String modeldir,String imgstr){
		StringBuffer guessjson = new StringBuffer();
		try {
			float[] result = NoMnistModel.guessImg(modeldir,imgstr);
			DecimalFormat   fnum  =   new  DecimalFormat("##0.00"); 
			guessjson.append("{");
			for (int i=0;i<result.length-1;i++) {
				guessjson.append("\""+i+"\":\""+fnum.format(result[i])+"\",");
			}
			guessjson.append("\""+(result.length-1)+"\":\""+fnum.format(result[result.length-1])+"\"");
			guessjson.append("}");
		} catch (Exception e) {
			guessjson.setLength(0);
			guessjson.append("{\"message\":\"°¡Ñ½£¡ÎÒ²Â²»³öÀ´(¨s£þ§¥£þ)¨s¨\¨T¨_,Çë°ïÎÒº°ÏÂSeanÐÞ¸´,°ÝÍÐÁË_(:3¡¹¡Ï)_¡£´íÎó´úÂë:002\"}");
		}
		System.out.println(guessjson.toString());
		return guessjson.toString();
	}
}
