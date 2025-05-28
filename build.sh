npm run oldbuild

cp ./lame.min.js ./dist

echo node_modules/onnxruntime-web/dist/ort-wasm.wasm 

cp \
    node_modules/@ricky0123/vad-web/dist/*.onnx \
    node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js \
    node_modules/onnxruntime-web/dist/*.wasm \
    ./dist/