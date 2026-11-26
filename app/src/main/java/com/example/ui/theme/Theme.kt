package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

private val LightColorScheme = lightColorScheme(
  primary = SkyPrimary,
  onPrimary = Color.White,
  primaryContainer = SkyContainer,
  onPrimaryContainer = OnSkyContainer,
  secondary = LeafSecondary,
  onSecondary = Color.White,
  secondaryContainer = LeafContainer,
  onSecondaryContainer = OnLeafContainer,
  tertiary = SunTertiary,
  onTertiary = Color.White,
  tertiaryContainer = SunContainer,
  onTertiaryContainer = OnSunContainer,
  error = CoralError,
  onError = Color.White,
  errorContainer = CoralContainer,
  onErrorContainer = OnCoralContainer,
  background = CloudBackground,
  onBackground = InkDark,
  surface = PureSurface,
  onSurface = InkDark,
  surfaceVariant = SoftSurfaceVariant,
  onSurfaceVariant = SlateMuted,
  outline = OutlineSoft,
)

private val DarkColorScheme = darkColorScheme(
  primary = DarkSkyPrimary,
  onPrimary = Color(0xFF002D47),
  primaryContainer = DarkSkyContainer,
  onPrimaryContainer = SkyContainer,
  secondary = DarkLeafSecondary,
  onSecondary = Color(0xFF003824),
  secondaryContainer = DarkLeafContainer,
  onSecondaryContainer = LeafContainer,
  tertiary = DarkSunTertiary,
  onTertiary = Color(0xFF422006),
  tertiaryContainer = DarkSunContainer,
  onTertiaryContainer = SunContainer,
  error = Color(0xFFFB7185),
  onError = Color(0xFF4C0519),
  errorContainer = Color(0xFF881337),
  onErrorContainer = CoralContainer,
  background = DarkBg,
  onBackground = DarkInk,
  surface = DarkSurface,
  onSurface = DarkInk,
  surfaceVariant = DarkSurfaceVariant,
  onSurfaceVariant = DarkMuted,
  outline = DarkOutline,
)

val AralShapes = Shapes(
  small = RoundedCornerShape(12.dp),
  medium = RoundedCornerShape(18.dp),
  large = RoundedCornerShape(24.dp),
  extraLarge = RoundedCornerShape(28.dp),
)

@Composable
fun AralScienceTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  content: @Composable () -> Unit,
) {
  val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
  MaterialTheme(
    colorScheme = colorScheme,
    typography = AralTypography,
    shapes = AralShapes,
    content = content,
  )
}
