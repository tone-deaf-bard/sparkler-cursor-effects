import { ref, onMounted, onUnmounted } from "vue";

export default function useCursorStyle() {
  const cursorX = ref(0);
  const cursorY = ref(0);
  const cursorStyle = ref({
    top: "100px",
    left: "100px",
    transform: "rotate(60deg)", // 左上角对准鼠标
  });

  const handleCursorMove = (event) => {
    cursorX.value = event.clientX;
    cursorY.value = event.clientY;

    // 设置样式，将左上角对准鼠标位置
    cursorStyle.value = {
      left: `${cursorX.value}px`,
      top: `${cursorY.value}px`,
      transform: "rotate(60deg)",
    };
  };

  onMounted(() => {
    document.addEventListener("mousemove", handleCursorMove);
  });

  onUnmounted(() => {
    document.removeEventListener("mousemove", handleCursorMove);
  });

  return {
    cursorStyle,
  };
}
