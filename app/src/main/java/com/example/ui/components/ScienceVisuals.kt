package com.example.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Air
import androidx.compose.material.icons.rounded.BatteryChargingFull
import androidx.compose.material.icons.rounded.Biotech
import androidx.compose.material.icons.rounded.Bolt
import androidx.compose.material.icons.rounded.BugReport
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Cloud
import androidx.compose.material.icons.rounded.Colorize
import androidx.compose.material.icons.rounded.CompassCalibration
import androidx.compose.material.icons.rounded.ContentCut
import androidx.compose.material.icons.rounded.DarkMode
import androidx.compose.material.icons.rounded.Eco
import androidx.compose.material.icons.rounded.ElectricBolt
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.FilterAlt
import androidx.compose.material.icons.rounded.FlashlightOn
import androidx.compose.material.icons.rounded.Hardware
import androidx.compose.material.icons.rounded.Landscape
import androidx.compose.material.icons.rounded.Lightbulb
import androidx.compose.material.icons.rounded.LocalFireDepartment
import androidx.compose.material.icons.rounded.NotificationsActive
import androidx.compose.material.icons.rounded.Park
import androidx.compose.material.icons.rounded.Pets
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Public
import androidx.compose.material.icons.rounded.Recycling
import androidx.compose.material.icons.rounded.Refresh
import androidx.compose.material.icons.rounded.Scale
import androidx.compose.material.icons.rounded.Science
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material.icons.rounded.Spa
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material.icons.rounded.Straighten
import androidx.compose.material.icons.rounded.Thermostat
import androidx.compose.material.icons.rounded.Timer
import androidx.compose.material.icons.rounded.Toys
import androidx.compose.material.icons.rounded.Umbrella
import androidx.compose.material.icons.rounded.WaterDrop
import androidx.compose.material.icons.rounded.Waves
import androidx.compose.material.icons.rounded.WbSunny
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.data.model.SimulationType
import com.example.ui.theme.CoralError
import com.example.ui.theme.LeafBright
import com.example.ui.theme.LeafSecondary
import com.example.ui.theme.SkyPrimary
import com.example.ui.theme.SkyPrimaryBright
import com.example.ui.theme.SunGold
import com.example.ui.theme.VioletAccent
import kotlin.math.roundToInt
import kotlin.math.sin
import kotlinx.coroutines.launch

/** Maps any science item label to an expressive icon and color pair for Select Pictures/Objects. */
fun resolveScienceVisual(label: String): Pair<ImageVector, Color> {
  val l = label.lowercase()
  return when {
    "thermometer" in l || "temperature" in l || "heat" in l -> Icons.Rounded.Thermostat to CoralError
    "ruler" in l || "meterstick" in l || "cm" in l || "mm" in l -> Icons.Rounded.Straighten to SkyPrimary
    "beaker" in l || "cylinder" in l || "liquid" in l || "solution" in l -> Icons.Rounded.Science to SkyPrimaryBright
    "hand lens" in l || "magnifying" in l || "observ" in l -> Icons.Rounded.Search to VioletAccent
    "balance" in l || "scale" in l || "mass" in l || "kg" in l || "mg" in l -> Icons.Rounded.Scale to SunGold
    "scissor" in l || "cut" in l -> Icons.Rounded.ContentCut to CoralError
    "stopwatch" in l || "timer" in l || "clock" in l -> Icons.Rounded.Timer to VioletAccent
    "magnet" in l || "iron" in l || "nail" in l || "steel" in l -> Icons.Rounded.CompassCalibration to CoralError
    "sun" in l || "light" in l || "lamp" in l || "flashlight" in l -> Icons.Rounded.WbSunny to SunGold
    "moon" in l || "night" in l || "star" in l || "constellation" in l -> Icons.Rounded.DarkMode to VioletAccent
    "planet" in l || "earth" in l || "solar" in l || "globe" in l -> Icons.Rounded.Public to SkyPrimary
    "cloud" in l || "rain" in l || "weather" in l || "storm" in l || "cyclone" in l -> Icons.Rounded.Cloud to SkyPrimaryBright
    "water" in l || "river" in l || "sea" in l || "rainwater" in l || "ice" in l || "evap" in l || "condens" in l -> Icons.Rounded.WaterDrop to SkyPrimary
    "wind" in l || "air" in l || "balloon" in l || "gas" in l || "steam" in l -> Icons.Rounded.Air to SkyPrimaryBright
    "volcano" in l || "lava" in l || "ash" in l || "mountain" in l || "rock" in l || "soil" in l || "sand" in l || "clay" in l || "loam" in l || "silt" in l -> Icons.Rounded.Landscape to SunGold
    "plant" in l || "leaf" in l || "leaves" in l || "seed" in l || "root" in l || "flower" in l || "tree" in l || "mangrove" in l || "fern" in l || "herbivore" in l -> Icons.Rounded.Eco to LeafSecondary
    "animal" in l || "bird" in l || "fish" in l || "frog" in l || "dog" in l || "cat" in l || "mammal" in l || "reptile" in l || "crab" in l || "snail" in l || "carnivore" in l -> Icons.Rounded.Pets to SunGold
    "butterfly" in l || "insect" in l || "worm" in l -> Icons.Rounded.BugReport to LeafBright
    "bacteria" in l || "fungi" in l || "micro" in l || "decompos" in l -> Icons.Rounded.Biotech to VioletAccent
    "heart" in l || "blood" in l || "circul" in l -> Icons.Rounded.Favorite to CoralError
    "lung" in l || "breath" in l || "nose" in l || "windpipe" in l -> Icons.Rounded.Spa to SkyPrimary
    "circuit" in l || "battery" in l || "wire" in l || "switch" in l || "electro" in l || "static" in l -> Icons.Rounded.ElectricBolt to SunGold
    "bulb" in l -> Icons.Rounded.Lightbulb to SunGold
    "sound" in l || "bell" in l || "speaker" in l || "ear" in l -> Icons.Rounded.NotificationsActive to VioletAccent
    "wave" in l || "crest" in l || "trough" in l -> Icons.Rounded.Waves to SkyPrimaryBright
    "burn" in l || "fire" in l || "flame" in l || "stove" in l -> Icons.Rounded.LocalFireDepartment to CoralError
    "recycl" in l || "compost" in l || "jar" in l || "bottle" in l -> Icons.Rounded.Recycling to LeafSecondary
    "filter" in l || "sieve" in l || "funnel" in l -> Icons.Rounded.FilterAlt to SkyPrimary
    "pulley" in l || "lever" in l || "wedge" in l || "ramp" in l -> Icons.Rounded.Settings to VioletAccent
    "umbrella" in l || "hat" in l || "shade" in l -> Icons.Rounded.Umbrella to SkyPrimary
    "gold" in l || "silver" in l || "copper" in l || "metal" in l || "wrench" in l -> Icons.Rounded.Hardware to SunGold
    else -> Icons.Rounded.Star to SkyPrimary
  }
}

@Composable
fun InteractiveHotspotScene(
  sceneTitle: String,
  hotspots: List<String>,
  selectedIndices: Set<Int>,
  correctIndices: Set<Int>,
  isSubmitted: Boolean,
  onToggleHotspot: (Int) -> Unit,
  modifier: Modifier = Modifier,
) {
  Column(
    modifier = modifier.fillMaxWidth(),
    verticalArrangement = Arrangement.spacedBy(12.dp),
  ) {
    // Rich Illustrated Scene Diagram Box
    Surface(
      shape = RoundedCornerShape(22.dp),
      color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.55f),
      border = BorderStroke(1.5.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
      modifier = Modifier
        .fillMaxWidth()
        .height(210.dp),
    ) {
      Box(modifier = Modifier.fillMaxSize()) {
        // Thematic Background Canvas Artwork based on sceneTitle
        SceneBackdropCanvas(sceneTitle = sceneTitle, modifier = Modifier.fillMaxSize())

        // Scene Title Pill
        Surface(
          color = MaterialTheme.colorScheme.surface.copy(alpha = 0.9f),
          shape = RoundedCornerShape(50),
          modifier = Modifier
            .align(Alignment.TopStart)
            .padding(10.dp),
        ) {
          Text(
            text = sceneTitle,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
          )
        }

        // Interactive Tappable Hotspot Pins positioned cleanly across the diagram
        Row(
          modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 12.dp, vertical = 24.dp),
          horizontalArrangement = Arrangement.SpaceEvenly,
          verticalAlignment = Alignment.CenterVertically,
        ) {
          hotspots.forEachIndexed { idx, label ->
            val isSelected = idx in selectedIndices
            val isCorrect = idx in correctIndices
            val bgColor = when {
              isSubmitted && isCorrect -> LeafSecondary
              isSubmitted && isSelected && !isCorrect -> CoralError
              isSelected -> SkyPrimary
              else -> MaterialTheme.colorScheme.surface
            }
            val contentColor = if (isSelected || (isSubmitted && isCorrect)) Color.White else MaterialTheme.colorScheme.onSurface
            val borderColor = when {
              isSubmitted && isCorrect -> LeafSecondary
              isSubmitted && isSelected && !isCorrect -> CoralError
              isSelected -> SkyPrimary
              else -> MaterialTheme.colorScheme.primary.copy(alpha = 0.45f)
            }
            val verticalShift = when (idx % 3) {
              0 -> (-14).dp
              1 -> 18.dp
              else -> (-6).dp
            }
            val (icon, tint) = resolveScienceVisual(label)

            Surface(
              onClick = { if (!isSubmitted) onToggleHotspot(idx) },
              shape = RoundedCornerShape(16.dp),
              color = bgColor,
              shadowElevation = if (isSelected) 6.dp else 2.dp,
              border = BorderStroke(2.dp, borderColor),
              modifier = Modifier
                .offset(y = verticalShift)
                .weight(1f, fill = false)
                .padding(horizontal = 4.dp)
                .testTag("hotspot_pin_$idx"),
            ) {
              Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
              ) {
                Icon(
                  imageVector = icon,
                  contentDescription = label,
                  tint = if (isSelected || (isSubmitted && isCorrect)) Color.White else tint,
                  modifier = Modifier.size(26.dp),
                )
                Spacer(Modifier.height(4.dp))
                Text(
                  text = label,
                  style = MaterialTheme.typography.labelMedium,
                  color = contentColor,
                  textAlign = TextAlign.Center,
                  maxLines = 2,
                )
              }
            }
          }
        }
      }
    }
    Text(
      text = "Tap a highlighted item on the science scene above.",
      style = MaterialTheme.typography.bodySmall,
      color = MaterialTheme.colorScheme.onSurfaceVariant,
    )
  }
}

@Composable
private fun SceneBackdropCanvas(sceneTitle: String, modifier: Modifier = Modifier) {
  val lower = sceneTitle.lowercase()
  Canvas(modifier = modifier) {
    val w = size.width
    val h = size.height
    when {
      "sky" in lower || "solar" in lower || "globe" in lower -> {
        drawRect(
          brush = Brush.verticalGradient(
            listOf(Color(0xFF0F172A), Color(0xFF1E3A8A), Color(0xFF312E81))
          )
        )
        drawCircle(Color(0xFFFDE047), radius = 26f, center = Offset(w * 0.16f, h * 0.28f))
        drawCircle(Color(0xFF38BDF8), radius = 18f, center = Offset(w * 0.5f, h * 0.52f))
        drawCircle(Color(0xFFE2E8F0), radius = 10f, center = Offset(w * 0.82f, h * 0.34f))
      }
      "water cycle" in lower || "erosion" in lower || "coastal" in lower || "weather" in lower -> {
        drawRect(
          brush = Brush.verticalGradient(
            listOf(Color(0xFFE0F2FE), Color(0xFFBAE6FD), Color(0xFF7DD3FC))
          )
        )
        drawRect(
          color = Color(0xFF0284C7).copy(alpha = 0.28f),
          topLeft = Offset(0f, h * 0.68f),
          size = Size(w, h * 0.32f),
        )
      }
      "wave" in lower || "slinky" in lower -> {
        drawRect(Color(0xFFEFF6FF))
        val path = Path()
        path.moveTo(0f, h * 0.5f)
        for (x in 0..w.toInt() step 8) {
          val y = h * 0.5f + sin(x / 42f) * (h * 0.25f)
          path.lineTo(x.toFloat(), y)
        }
        drawPath(path, color = Color(0xFF0EA5E9), style = Stroke(width = 6f, cap = StrokeCap.Round))
      }
      "volcano" in lower || "landscape" in lower -> {
        drawRect(
          brush = Brush.verticalGradient(listOf(Color(0xFFFEF3C7), Color(0xFFFDE68A)))
        )
        val mountain = Path().apply {
          moveTo(w * 0.2f, h)
          lineTo(w * 0.45f, h * 0.28f)
          lineTo(w * 0.55f, h * 0.28f)
          lineTo(w * 0.8f, h)
          close()
        }
        drawPath(mountain, color = Color(0xFF78350F).copy(alpha = 0.25f))
      }
      else -> {
        drawRect(
          brush = Brush.linearGradient(
            listOf(Color(0xFFE0F2FE), Color(0xFFD1FAE5))
          )
        )
        drawRoundRect(
          color = Color(0xFF94A3B8).copy(alpha = 0.2f),
          topLeft = Offset(18f, h * 0.72f),
          size = Size(w - 36f, 16f),
          cornerRadius = CornerRadius(8f, 8f),
        )
      }
    }
  }
}

@Composable
fun InteractiveRulerSlider(
  minValue: Int,
  maxValue: Int,
  targetValue: Int,
  unit: String,
  currentValue: Float,
  isSubmitted: Boolean,
  onValueChange: (Float) -> Unit,
  modifier: Modifier = Modifier,
) {
  Column(
    modifier = modifier.fillMaxWidth(),
    verticalArrangement = Arrangement.spacedBy(14.dp),
  ) {
    Surface(
      shape = RoundedCornerShape(20.dp),
      color = MaterialTheme.colorScheme.surface,
      border = BorderStroke(1.5.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
      modifier = Modifier.fillMaxWidth(),
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Text("Virtual Metric Ruler", style = MaterialTheme.typography.titleSmall)
          Surface(
            color = SkyPrimary.copy(alpha = 0.14f),
            shape = RoundedCornerShape(50),
          ) {
            Text(
              text = "${currentValue.roundToInt()} $unit",
              style = MaterialTheme.typography.titleMedium,
              color = SkyPrimary,
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
            )
          }
        }
        Spacer(Modifier.height(16.dp))
        Canvas(
          modifier = Modifier
            .fillMaxWidth()
            .height(92.dp)
        ) {
          val pad = 24f
          val rulerW = size.width - pad * 2
          // Ruler wooden body
          drawRoundRect(
            color = Color(0xFFFDE68A),
            topLeft = Offset(pad, 28f),
            size = Size(rulerW, 56f),
            cornerRadius = CornerRadius(10f, 10f),
          )
          // Tick marks for every cm from minValue to maxValue
          val span = (maxValue - minValue).coerceAtLeast(1)
          for (i in 0..span) {
            val x = pad + (i.toFloat() / span) * rulerW
            val tickH = if (i % 5 == 0) 26f else 14f
            drawLine(
              color = Color(0xFF78350F),
              start = Offset(x, 28f),
              end = Offset(x, 28f + tickH),
              strokeWidth = if (i % 5 == 0) 3.5f else 2f,
            )
          }
          // Current marker pin
          val frac = ((currentValue - minValue) / span).coerceIn(0f, 1f)
          val mx = pad + frac * rulerW
          drawLine(
            color = Color(0xFF0284C7),
            start = Offset(mx, 4f),
            end = Offset(mx, 84f),
            strokeWidth = 5f,
            cap = StrokeCap.Round,
          )
          drawCircle(
            color = Color(0xFF0284C7),
            radius = 10f,
            center = Offset(mx, 10f),
          )
          if (isSubmitted) {
            val tf = ((targetValue - minValue).toFloat() / span).coerceIn(0f, 1f)
            val tx = pad + tf * rulerW
            drawCircle(
              color = Color(0xFF059669),
              radius = 9f,
              center = Offset(tx, 56f),
            )
          }
        }
        Slider(
          value = currentValue,
          onValueChange = { if (!isSubmitted) onValueChange(it) },
          valueRange = minValue.toFloat()..maxValue.toFloat(),
          steps = (maxValue - minValue - 1).coerceAtLeast(0),
          colors = SliderDefaults.colors(
            thumbColor = SkyPrimary,
            activeTrackColor = SkyPrimary,
          ),
          modifier = Modifier.testTag("ruler_slider"),
        )
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
        ) {
          Text("$minValue $unit", style = MaterialTheme.typography.labelSmall)
          Text("15 $unit", style = MaterialTheme.typography.labelSmall)
          Text("$maxValue $unit", style = MaterialTheme.typography.labelSmall)
        }
      }
    }
  }
}

@Composable
fun InteractiveScienceSimulation(
  simType: SimulationType,
  choices: List<String>,
  selectedChoice: Int?,
  correctIndex: Int,
  isSubmitted: Boolean,
  simHasRun: Boolean,
  onRunSimulation: () -> Unit,
  onSelectChoice: (Int) -> Unit,
  modifier: Modifier = Modifier,
) {
  val scope = rememberCoroutineScope()
  val animProgress = remember { Animatable(0f) }

  Column(
    modifier = modifier.fillMaxWidth(),
    verticalArrangement = Arrangement.spacedBy(12.dp),
  ) {
    Surface(
      shape = RoundedCornerShape(22.dp),
      color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
      border = BorderStroke(1.5.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
      modifier = Modifier.fillMaxWidth(),
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Text(
            text = if (simType == SimulationType.CART_PUSH) "Force & Cart Simulator" else "Gravity Drop Simulator (1.5 m)",
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.primary,
          )
          Button(
            onClick = {
              onRunSimulation()
              scope.launch {
                animProgress.snapTo(0f)
                animProgress.animateTo(
                  1f,
                  animationSpec = tween(durationMillis = 1000, easing = FastOutSlowInEasing),
                )
              }
            },
            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 14.dp, vertical = 6.dp),
            modifier = Modifier.testTag("run_simulation_button"),
          ) {
            Icon(
              imageVector = if (simHasRun) Icons.Rounded.Refresh else Icons.Rounded.PlayArrow,
              contentDescription = null,
              modifier = Modifier.size(18.dp),
            )
            Spacer(Modifier.width(4.dp))
            Text(if (simType == SimulationType.CART_PUSH) "Apply Force" else "Drop Balls")
          }
        }
        Spacer(Modifier.height(12.dp))
        Canvas(
          modifier = Modifier
            .fillMaxWidth()
            .height(145.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(MaterialTheme.colorScheme.surface)
        ) {
          val w = size.width
          val h = size.height
          val t = animProgress.value
          if (simType == SimulationType.CART_PUSH) {
            // Track line
            drawLine(
              color = Color(0xFF94A3B8),
              start = Offset(24f, h * 0.78f),
              end = Offset(w - 24f, h * 0.78f),
              strokeWidth = 6f,
            )
            // Cart moves left from center (0.55 -> 0.2)
            val cx = w * (0.55f - 0.32f * t)
            drawRoundRect(
              color = Color(0xFF0EA5E9),
              topLeft = Offset(cx - 42f, h * 0.48f),
              size = Size(84f, 36f),
              cornerRadius = CornerRadius(10f, 10f),
            )
            drawCircle(Color(0xFF0F172A), radius = 11f, center = Offset(cx - 22f, h * 0.75f))
            drawCircle(Color(0xFF0F172A), radius = 11f, center = Offset(cx + 22f, h * 0.75f))
            // Push arrow pointing LEFT
            drawLine(
              color = Color(0xFFE11D48),
              start = Offset(cx + 95f, h * 0.6f),
              end = Offset(cx + 48f, h * 0.6f),
              strokeWidth = 6f,
              cap = StrokeCap.Round,
            )
          } else {
            // Padded mat at bottom
            drawRoundRect(
              color = Color(0xFF10B981).copy(alpha = 0.25f),
              topLeft = Offset(24f, h * 0.82f),
              size = Size(w - 48f, 18f),
              cornerRadius = CornerRadius(8f, 8f),
            )
            val startY = 26f
            val endY = h * 0.74f
            val curY = startY + (endY - startY) * (t * t)
            // Heavy rubber ball (left) & light ping-pong ball (right) falling at same rate
            drawCircle(Color(0xFF0284C7), radius = 22f, center = Offset(w * 0.34f, curY))
            drawCircle(Color(0xFFF59E0B), radius = 20f, center = Offset(w * 0.66f, curY))
          }
        }
      }
    }

    Text(
      text = "Choose what you observed:",
      style = MaterialTheme.typography.titleSmall,
    )
    choices.forEachIndexed { idx, ch ->
      val isSelected = selectedChoice == idx
      val isCorrect = idx == correctIndex
      val border = when {
        isSubmitted && isCorrect -> LeafSecondary
        isSubmitted && isSelected && !isCorrect -> CoralError
        isSelected -> SkyPrimary
        else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
      }
      val bg = when {
        isSubmitted && isCorrect -> LeafSecondary.copy(alpha = 0.14f)
        isSubmitted && isSelected && !isCorrect -> CoralError.copy(alpha = 0.12f)
        isSelected -> SkyPrimary.copy(alpha = 0.12f)
        else -> MaterialTheme.colorScheme.surface
      }
      Surface(
        onClick = { if (!isSubmitted) onSelectChoice(idx) },
        shape = RoundedCornerShape(16.dp),
        color = bg,
        border = BorderStroke(2.dp, border),
        modifier = Modifier
          .fillMaxWidth()
          .testTag("sim_choice_$idx"),
      ) {
        Row(
          modifier = Modifier.padding(14.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween,
        ) {
          Text(ch, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
          if (isSelected) {
            Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = border)
          }
        }
      }
    }
  }
}
