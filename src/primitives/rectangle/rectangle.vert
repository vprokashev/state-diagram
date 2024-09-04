#version 300 es
in vec2 aPosition;
uniform mat4 uWorld;

void main() {
    vec4 position = vec4(aPosition, 0.0, 1.0);
    gl_Position = uWorld * position;
}
