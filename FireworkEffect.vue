<template>
  <canvas id="fireworkCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 粒子类
class Particle {
  constructor(x, y, isStatic, color) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 1.5; // 静止点更大
    this.color = color;

    if (isStatic) {
      this.velocityX = 0;
      this.velocityY = 0;
    } else {
      const angle = Math.random() * 2 * Math.PI; // 生成 0 到 2π 的随机角度
      const speed = Math.random() * 2 - 0.5 + 1; // 速度随机范围 (1-3)
      this.velocityX = Math.cos(angle) * speed; // 水平方向速度
      this.velocityY = Math.sin(angle) * speed; // 垂直方向速度
    }

    this.gravity = isStatic ? 0 : 0.05; // 动态粒子受重力影响
    this.life = Math.random() * 100; // 粒子生命周期
  }

  update() {
    if (this.velocityX !== 0 || this.velocityY !== 0) {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.velocityY += this.gravity; // 模拟重力
    }
    this.life -= 1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const canvas = ref(null);
const bgImage = new Image();
bgImage.src = "/girl.png"; // 背景图片路径
let ctx = null;
let particles = [];
const mousePosition = ref({ x: 0, y: 0 }); // 鼠标位置
let maxParticles = 100; // 当前粒子上限
let lastMouseMove = Date.now(); // 上次鼠标移动时间

// 背景图片绘制
const drawBackgroundImage = () => {
  const canvasAspectRatio = canvas.value.width / canvas.value.height;
  const imageAspectRatio = bgImage.width / bgImage.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasAspectRatio > imageAspectRatio) {
    drawWidth = canvas.value.width;
    drawHeight = canvas.value.width / imageAspectRatio;
    offsetX = 0;
    offsetY = (canvas.value.height - drawHeight) / 2;
  } else {
    drawHeight = canvas.value.height;
    drawWidth = canvas.value.height * imageAspectRatio;
    offsetX = (canvas.value.width - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);
};

// 粒子管理（创建和分裂粒子）

// 创建粒子
const createParticleAtMouse = () => {
  // 添加静止点
  particles.push(
    new Particle(
      mousePosition.value.x - 1,
      mousePosition.value.y,
      true,
      "#FDFCEA"
    )
  );
  particles.push(
    new Particle(
      mousePosition.value.x - 1,
      mousePosition.value.y + 0.3,
      true,
      "#F9EA94"
    )
  );
  particles.push(
    new Particle(
      mousePosition.value.x - 1,
      mousePosition.value.y - 0.3,
      true,
      "#F9EA94"
    )
  );
  particles.push(
    new Particle(
      mousePosition.value.x - 1.3,
      mousePosition.value.y,
      true,
      "#FDFCEA"
    )
  );
  particles.push(
    new Particle(
      mousePosition.value.x - 0.7,
      mousePosition.value.y,
      true,
      "#FDFCEA"
    )
  );

  // // 添加动态粒子
  particles.push(
    new Particle(mousePosition.value.x, mousePosition.value.y, false, "#FDFCEA")
  );
  particles.push(
    new Particle(mousePosition.value.x, mousePosition.value.y, false, "#F9EA94")
  );
  particles.push(
    new Particle(mousePosition.value.x, mousePosition.value.y, false, "#D7A26E")
  );
  
};

const createParticleShatter = () => {
  // 筛选出生命周期大于 20 的粒子
  const eligibleParticles = particles.filter((p) => p.life > 30);
  const M = eligibleParticles.length;

  // 随机选取 [0, M / 2] 个粒子进行替换
  const countToReplace = Math.floor(Math.random() * (M / 4 + 1));

  for (let i = 0; i < countToReplace; i++) {
    // 随机选择一个粒子进行替换
    const index = Math.floor(Math.random() * eligibleParticles.length);
    const particle = eligibleParticles[index];

    if (!particle) continue;

    // 从 particles 数组中移除被选中的粒子
    const originalIndex = particles.indexOf(particle);
    if (originalIndex !== -1) particles.splice(originalIndex, 1);

    // 随机生成 1~4 个新粒子
    const numNewParticles = Math.floor(Math.random() * 4) + 1;

    for (let j = 0; j < numNewParticles; j++) {
      const newParticle = new Particle(
        particle.x,
        particle.y,
        false,
        particle.color
      );

      // 设置新粒子的生命周期为均分原粒子的剩余生命周期
      newParticle.life = Math.floor(particle.life / numNewParticles);
      particles.push(newParticle);
    }

    // 从筛选的粒子列表中移除已替换的粒子
    eligibleParticles.splice(index, 1);
  }
};

// 动画函数
const animate = () => {
  ctx.globalAlpha = 0.2;
  drawBackgroundImage();
  ctx.globalAlpha = 1.0;

  // 更新和绘制粒子
  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => {
    particle.update();
    particle.draw(ctx);
  });

  // 粒子创建和分裂逻辑
  if(particles.length<maxParticles){
    createParticleAtMouse();
    createParticleShatter();
  }
  // console.log(maxParticles,":",particles.length)
  requestAnimationFrame(animate);
};

// 调整粒子上限
const manageParticles = () => {
  const now = Date.now();
  const timeSinceLastMove = now - lastMouseMove;

  if (timeSinceLastMove < 1000) {
    // 鼠标移动时增加粒子上限
    maxParticles = Math.min(400, maxParticles + 10);
  } else {
    // 鼠标静止时减少粒子上限
    maxParticles = Math.max(0, maxParticles - 10);
  }
};

// 挂载生命周期
onMounted(() => {
  canvas.value = document.getElementById("fireworkCanvas");
  ctx = canvas.value.getContext("2d");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.value.getBoundingClientRect();
    const ratio = window.devicePixelRatio/2 || 1;
    mousePosition.value.x = (e.clientX - rect.left) * ratio;
    mousePosition.value.y = (e.clientY - rect.top) * ratio;

    lastMouseMove = Date.now(); // 更新鼠标移动时间
  });

  setInterval(manageParticles, 1000); // 每 0.5 秒调整粒子上限
  animate(); // 启动动画
});

// 卸载生命周期
onUnmounted(() => {
  window.removeEventListener("mousemove", (e) => {});
});
</script>

<style scoped>
canvas {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
</style>
