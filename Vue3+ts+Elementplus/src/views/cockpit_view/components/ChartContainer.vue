<template>
  <div ref="chartRef" class="chart-container" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

interface Props {
  options: any
  width?: string
  height?: string
  theme?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  theme: 'dark'
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value, props.theme)
  chartInstance.setOption(props.options, true)
}

// 更新图表配置
const updateChart = () => {
  if (chartInstance && props.options) {
    chartInstance.setOption(props.options, true)
  }
}

// 调整图表大小
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 监听配置变化
watch(() => props.options, updateChart, { deep: true })

// 监听窗口大小变化
const handleResize = () => {
  resizeChart()
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

// 暴露方法给父组件
defineExpose({
  getInstance: () => chartInstance,
  resize: resizeChart,
  setOption: (option: any) => chartInstance?.setOption(option, true)
})
</script>

<style scoped lang="scss">
.chart-container {
  position: relative;
}
</style> 