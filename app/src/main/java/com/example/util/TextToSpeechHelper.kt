package com.example.util

import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.Locale

class TextToSpeechHelper(context: Context) {
  private var tts: TextToSpeech? = null
  private var isReady = false

  init {
    tts = TextToSpeech(context.applicationContext) { status ->
      if (status == TextToSpeech.SUCCESS) {
        val result = tts?.setLanguage(Locale.US)
        isReady = result != TextToSpeech.LANG_MISSING_DATA &&
          result != TextToSpeech.LANG_NOT_SUPPORTED
        tts?.setSpeechRate(0.95f)
      }
    }
  }

  fun speak(text: String) {
    if (!isReady) return
    val cleaned = text.replace("______", "blank").replace("→", " to ")
    tts?.speak(cleaned, TextToSpeech.QUEUE_FLUSH, null, "aral_science_tts")
  }

  fun stop() {
    tts?.stop()
  }

  fun shutdown() {
    tts?.stop()
    tts?.shutdown()
    tts = null
    isReady = false
  }
}
