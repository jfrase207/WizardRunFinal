package uk.co.jfrase207.wizardrunfinal;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.MediaPlayer;
import android.webkit.JavascriptInterface;

import java.io.IOException;

public class AudioInterface {
    //create a context object and a mediaplayer object
    Context mContext;
    MediaPlayer MusicPlayer;
    //assign values to the variables
    AudioInterface(Context c) {
        mContext = c;
        MusicPlayer = new MediaPlayer();
    }

    //Play an audio file
    @JavascriptInterface
    public void playAudio(String aud, boolean loop) throws IOException {
        //String aud - file name passed and boolean loop true or false passed
        //from the JavaScript function
        AssetFileDescriptor fileDescriptor = mContext.getAssets().openFd(aud);
        MusicPlayer.setDataSource(fileDescriptor.getFileDescriptor(), fileDescriptor.getStartOffset(), fileDescriptor.getLength());
        fileDescriptor.close();
        MusicPlayer.prepare();
        MusicPlayer.start();
        MusicPlayer.setLooping(loop);

    }

    @JavascriptInterface
    public void playSoundEffect(String aud) throws IOException {
        //String aud - file name passed
        //from the JavaScript function
        final MediaPlayer mpe;
        AssetFileDescriptor fileDescriptor = mContext.getAssets().openFd(aud);
        mpe = new MediaPlayer();
        mpe.setDataSource(fileDescriptor.getFileDescriptor(), fileDescriptor.getStartOffset(), fileDescriptor.getLength());
        fileDescriptor.close();
        mpe.prepare();
        mpe.start();
    }
}
