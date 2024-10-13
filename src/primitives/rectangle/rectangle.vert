#version 300 es
in vec2 aNDCPosition;
uniform mat4 uProjection;

void main() {
    gl_Position = uProjection * vec4(aNDCPosition, 0.0, 1.0);
}
