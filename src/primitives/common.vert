#version 300 es
in vec2 a_position;
uniform vec2 u_translation;
uniform vec2 u_scale;

void main() {
    vec2 scaledPosition = a_position * u_scale;
    vec2 translatedPosition = scaledPosition + u_translation;
    gl_Position = vec4(translatedPosition, 0.0, 1.0);
}
