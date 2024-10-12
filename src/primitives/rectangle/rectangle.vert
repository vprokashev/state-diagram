#version 300 es
in vec2 aNDCPosition;  // Входные нормализованные координаты устройства (NDC)
uniform vec2 uScale;   // Масштабирование в пикселях
uniform vec2 uPosition; // Позиция в пикселях
uniform mat4 uCamera;  // Матрица камеры

void main() {
    vec2 uViewportSize = vec2(640, 480);
    // Преобразуем масштаб и позицию из пикселей в нормализованные координаты устройства (NDC)
    vec2 scaleInNDC = uScale / uViewportSize * 2.0;
    vec2 positionInNDC = (uPosition / uViewportSize) * 2.0 - 1.0;

    // Применяем масштабирование и смещение к входным нормализованным координатам
    vec2 scaledPosition = aNDCPosition * scaleInNDC;
    vec2 translatedPosition = scaledPosition + positionInNDC;

    // Преобразуем 2D координаты в 4D вектор
    vec4 position = vec4(translatedPosition, 0.0, 1.0);

    // Применяем матрицу камеры
    gl_Position = uCamera * position;
}
