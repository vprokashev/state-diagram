#version 300 es
in vec2 a_position;
uniform mat3 u_local; // size, center, rotation
uniform mat3 u_world; // relative position

void main() {
    vec3 location = u_world * u_local * vec3(a_position, 1.0);
    gl_Position = vec4(location.xy, 0.0, 1.0);
}
