package com.sean.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

	public static String DateToTimeStamp(Date date){
		SimpleDateFormat sd = new SimpleDateFormat("YYYYMMddHHmmss-SSS");
		return sd.format(date);
	}
}
