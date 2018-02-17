package com.sean.nomnist;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.FloatBuffer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import javax.imageio.ImageIO;

import org.tensorflow.Graph;
import org.tensorflow.Session;
import org.tensorflow.Tensor;

public class NoMnistModel {

	public static void main(String[] args) throws Exception {
		Graph g = new Graph();  
	    Session s = new Session(g);
		File directory = new File("");
		String modelDir = directory.getCanonicalPath()+"\\src\\main\\resources";  
		System.out.println(modelDir);
		byte[] graphDef = readAllBytesOrExit(Paths.get(modelDir, "model.pb"));  
		
		g.importGraphDef(graphDef);  
		float[] img = imageToFloat("D:\\tensorflow\\workspace\\notMNIST_large\\D\\aG9tZXdvcmsgc21hcnQudHRm.png");
		Tensor<?> input = constructTensor(img);  
		
		Tensor<?> result = s.runner().feed("tf_sean_input", input).fetch("logits").run().get(0);  
		long[] rshape = result.shape();  
		int nlabels = (int) rshape[1];  
		int batchSize = (int) rshape[0];  
		float[][] logits = (float[][]) result.copyTo(new float[batchSize][nlabels]);
		for (float fs : logits[0]) {
				System.out.println(fs);
		}
		s.close();
	}
	public static float[]  guessImg(String modeldir,String imgpath) throws Exception {
		Graph g = new Graph();  
	    Session s = new Session(g);
		byte[] graphDef = readAllBytesOrExit(Paths.get(modeldir, "model.pb"));  
		
		g.importGraphDef(graphDef);  
		float[] img = imageToFloat(imgpath);
		Tensor<?> input = constructTensor(img);  
		
		Tensor<?> result = s.runner().feed("tf_sean_input", input).fetch("logits").run().get(0);  
		long[] rshape = result.shape();  
		int nlabels = (int) rshape[1];  
		int batchSize = (int) rshape[0];  
		float[][] logits = (float[][]) result.copyTo(new float[batchSize][nlabels]);
		s.close();
		return logits[0];
	}
	
	private static byte[] readAllBytesOrExit(Path path) throws Exception {
		return Files.readAllBytes(path);
	}
	private static float[] imageToFloat(String srcImagePath){
		float[] rgb = new float[3];  
		float relust[] = new float[784];
        File file = new File(srcImagePath);  
        BufferedImage bi = null;  
        try {  
            bi = ImageIO.read(file);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        int width = bi.getWidth();  
        int height = bi.getHeight();  
        for (int i = 0; i < height ; i++) {  
            for (int j = 0; j < width; j++) {  
                int pixel = bi.getRGB(j, i); // 下面三行代码将一个数字转换为RGB数字  
                rgb[0] = (pixel & 0xff0000) >> 16;  
                rgb[1] = (pixel & 0xff00) >> 8;  
                rgb[2] = (pixel & 0xff);  
                relust[i*width+j] =  (float) (((rgb[0]+rgb[1]+rgb[2])/3.0 - 255.0/2.0 )/255.0);
            }  
        }
        return relust;
	}
	@SuppressWarnings({ "rawtypes" })
	private static Tensor constructTensor(float img[]) {
		long[] shape = {1,28,28,1};
		Tensor input = Tensor.create(shape,FloatBuffer.wrap(img));
		return input;
	}
}
