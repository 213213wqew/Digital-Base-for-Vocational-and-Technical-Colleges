// ECharts 图表配置文件 - 职业院校数字基座大屏

// 通用配置
const commonConfig = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#ffffff',
    fontSize: 12
  },
  tooltip: {
    backgroundColor: 'rgba(0, 18, 40, 0.9)',
    borderColor: '#4fd6ff',
    borderWidth: 1,
    textStyle: {
      color: '#ffffff',
      fontSize: 12
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(79, 214, 255, 0.3);'
  },
  legend: {
    textStyle: {
      color: '#ffffff',
      fontSize: 12
    }
  }
}

// 学生状态分布饼图配置
export const getStudentStatusPieOption = (data: any[]) => {
  // 只保留前3项，其余合并为“其他状态”
  let sorted = [...data].sort((a, b) => b.value - a.value)
  let mainItems = sorted.slice(0, 3)
  let otherValue = sorted.slice(3).reduce((sum, item) => sum + item.value, 0)
  if (otherValue > 0) {
    mainItems.push({ name: '其他状态', value: otherValue, itemStyle: { color: '#ffb980' } })
  }
  return {
    ...commonConfig,
    // title: {
    //   text: '学生状态分布',
    //   left: 'center',
    //   top: 30,
    //   textStyle: { color: '#4fd6ff', fontSize: 16, fontWeight: 'bold' }
    // },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      itemGap: 14,
      textStyle: { color: '#b2d8ff', fontSize: 11 }
    },
    tooltip: {
      ...commonConfig.tooltip,
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '学生状态',
      type: 'pie',
      radius: ['70%', '88%'],
      center: ['38%', '50%'],
      data: mainItems,
      minShowLabelAngle: 10,
      label: {
        show: true,
        position: 'outside',
        fontSize: 9,
        color: 'rgba(208,234,255,0.85)',
        formatter: '{b|{b}}\n{c} ({d}%)',
        rich: {
          b: { fontSize: 9, color: 'rgba(208,234,255,0.85)', fontWeight: 'normal' }
        },
        hideOverlap: true,
        textShadowColor: '#001a2a',
        textShadowBlur: 2
      },
      labelLine: {
        show: true,
        length: 6,
        length2: 2,
        smooth: 0.8
      }
    }]
  }
}

// 专业分布柱状图配置
export const getMajorDistributionBarOption = (categories: string[], values: number[]) => ({
  ...commonConfig,
  title: {
    text: '各专业学生分布',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#4fd6ff',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    ...commonConfig.tooltip,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '25%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: categories,
    axisLabel: {
      color: '#ffffff',
      fontSize: 10,
      rotate: 30
    },
    axisLine: {
      lineStyle: {
        color: '#4fd6ff'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#4fd6ff'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#ffffff',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: '#4fd6ff'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(79, 214, 255, 0.2)'
      }
    }
  },
  series: [{
    type: 'bar',
    data: values,
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#4fd6ff' },
          { offset: 1, color: '#2d8cf0' }
        ]
      },
      borderRadius: [4, 4, 0, 0]
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(79, 214, 255, 0.7)'
      }
    }
  }]
})

// 月度趋势折线图配置
export const getMonthlyTrendLineOption = (data: any) => ({
  ...commonConfig,
  title: {
    text: '教学质量月度趋势分析',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#4fd6ff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    ...commonConfig.tooltip,
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#4fd6ff'
      }
    }
  },
  legend: {
    ...commonConfig.legend,
    data: ['课程完成率', '教学质量评分', '就业率', '数字化设备率'],
    top: 50,
    left: 'center'
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '25%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: data.months,
    axisLabel: {
      color: '#ffffff',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: '#4fd6ff'
      }
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '百分比(%)',
      position: 'left',
      axisLabel: {
        color: '#ffffff',
        fontSize: 10
      },
      axisLine: {
        lineStyle: {
          color: '#4fd6ff'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(79, 214, 255, 0.2)'
        }
      }
    },
    {
      type: 'value',
      name: '评分',
      position: 'right',
      min: 4,
      max: 5,
      axisLabel: {
        color: '#ffffff',
        fontSize: 10
      },
      axisLine: {
        lineStyle: {
          color: '#36ce9e'
        }
      }
    }
  ],
  series: [
    {
      name: '课程完成率',
      type: 'line',
      data: data.courseCompletion,
      smooth: true,
      itemStyle: { color: '#4fd6ff' },
      lineStyle: { width: 3 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 214, 255, 0.4)' },
            { offset: 1, color: 'rgba(79, 214, 255, 0.1)' }
          ]
        }
      }
    },
    {
      name: '教学质量评分',
      type: 'line',
      yAxisIndex: 1,
      data: data.teachingQuality,
      smooth: true,
      itemStyle: { color: '#36ce9e' },
      lineStyle: { width: 3 }
    },
    {
      name: '就业率',
      type: 'line',
      data: data.employmentRate,
      smooth: true,
      itemStyle: { color: '#f39c12' },
      lineStyle: { width: 3 }
    },
    {
      name: '数字化设备率',
      type: 'line',
      data: data.digitalEquipment,
      smooth: true,
      itemStyle: { color: '#e74c3c' },
      lineStyle: { width: 3 }
    }
  ]
})

// 课程开设情况环形图配置
export const getCourseTypeDonutOption = (data: any[]) => {
  // 只保留前3项，其余合并为“其他课程”
  let sorted = [...data].sort((a, b) => b.value - a.value)
  let mainItems = sorted.slice(0, 3)
  let otherValue = sorted.slice(3).reduce((sum, item) => sum + item.value, 0)
  if (otherValue > 0) {
    mainItems.push({ name: '其他课程', value: otherValue, itemStyle: { color: '#ffb980' } })
  }
  return {
    ...commonConfig,
    // title: {
    //   text: '课程开设情况',
    //   left: 'center',
    //   top: 38,
    //   textStyle: {
    //     color: '#4fd6ff',
    //     fontSize: 16,
    //     fontWeight: 'bold'
    //   }
    // },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      itemGap: 14,
      textStyle: { color: '#b2d8ff', fontSize: 11 }
    },
    tooltip: {
      ...commonConfig.tooltip,
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '课程类型',
      type: 'pie',
      radius: ['70%', '88%'],
      center: ['38%', '50%'],
      data: mainItems,
      minShowLabelAngle: 10,
      label: {
        show: true,
        position: 'outside',
        fontSize: 9,
        color: 'rgba(208,234,255,0.85)',
        formatter: '{b|{b}}\n{c} ({d}%)',
        rich: {
          b: { fontSize: 9, color: 'rgba(208,234,255,0.85)', fontWeight: 'normal' }
        },
        hideOverlap: true,
        textShadowColor: '#001a2a',
        textShadowBlur: 2
      },
      labelLine: {
        show: true,
        length: 6,
        length2: 2,
        smooth: 0.8
      }
    }]
  }
}

// 教学资源利用率雷达图配置
export const getResourceRadarOption = (data: any) => ({
  ...commonConfig,
  title: {
    text: '教学资源利用率',
    left: 'center',
    top: 24,
    textStyle: { color: '#4fd6ff', fontSize: 16, fontWeight: 'bold' }
  },
  legend: {
    orient: 'vertical',
    right: 0,
    top: 'center',
    itemGap: 14,
    textStyle: { color: '#b2d8ff', fontSize: 11 }
  },
  radar: {
    indicator: data.indicators,
    center: ['50%', '50%'],
    radius: 48, // 再缩小
    axisName: {
      color: 'rgba(208,234,255,0.85)',
      fontSize: 11,
      fontWeight: 'normal',
      textShadowColor: '#001a2a',
      textShadowBlur: 2
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(79, 214, 255, 0.18)',
        width: 1
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(79, 214, 255, 0.25)',
        width: 1
      }
    },
    splitArea: {
      areaStyle: {
        color: [
          'rgba(79, 214, 255, 0.08)',
          'rgba(79, 214, 255, 0.03)'
        ]
      }
    }
  },
  series: [{
    type: 'radar',
    data: data.data,
    areaStyle: { opacity: 0.18 },
    lineStyle: { width: 3, color: '#4fd6ff' },
    symbol: 'circle',
    symbolSize: 5, // 再缩小
    itemStyle: { color: '#4fd6ff', borderColor: '#fff', borderWidth: 2 }
  }]
})

// 院系数据对比柱状图配置
export const getDepartmentComparisonOption = (departments: any[]) => ({
  ...commonConfig,
  title: {
    text: '院系数据对比分析',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#4fd6ff',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    ...commonConfig.tooltip,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    ...commonConfig.legend,
    data: ['学生数', '教师数', '课程数', '实验室数'],
    top: 50
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '15%',
    top: '25%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: departments.map(d => d.name.replace('学院', '')),
    axisLabel: {
      color: '#ffffff',
      fontSize: 10,
      rotate: 30
    },
    axisLine: {
      lineStyle: {
        color: '#4fd6ff'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#ffffff',
      fontSize: 10
    },
    axisLine: {
      lineStyle: {
        color: '#4fd6ff'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(79, 214, 255, 0.2)'
      }
    }
  },
  series: [
    {
      name: '学生数',
      type: 'bar',
      data: departments.map(d => Math.floor(d.students / 10)), // 缩放以便显示
      itemStyle: { color: '#4fd6ff' }
    },
    {
      name: '教师数',
      type: 'bar',
      data: departments.map(d => d.teachers),
      itemStyle: { color: '#36ce9e' }
    },
    {
      name: '课程数',
      type: 'bar',
      data: departments.map(d => d.courses),
      itemStyle: { color: '#f39c12' }
    },
    {
      name: '实验室数',
      type: 'bar',
      data: departments.map(d => d.labs),
      itemStyle: { color: '#e74c3c' }
    }
  ]
})

// 就业行业分布饼图配置
export const getIndustryDistributionOption = (data: any[]) => ({
  ...commonConfig,
  title: {
    text: '毕业生就业行业分布',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#4fd6ff',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    ...commonConfig.tooltip,
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}% ({d}%)'
  },
  series: [{
    name: '就业行业',
    type: 'pie',
    radius: ['25%', '75%'],
    center: ['50%', '60%'],
    roseType: 'radius', // 玫瑰图
    data: data.map(item => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: item.color }
    })),
    emphasis: {
      itemStyle: {
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowColor: 'rgba(79, 214, 255, 0.5)'
      }
    },
    label: {
      color: '#ffffff',
      fontSize: 12
    },
    labelLine: {
      lineStyle: {
        color: '#ffffff'
      }
    }
  }]
})

// 实时数据仪表盘配置
export const getGaugeOption = (value: number, title: string, max: number = 100) => ({
  ...commonConfig,
  series: [{
    name: title,
    type: 'gauge',
    min: 0,
    max,
    splitNumber: 5,
    radius: '80%',
    center: ['50%', '55%'],
    startAngle: 225,
    endAngle: -45,
    axisLine: {
      lineStyle: {
        width: 8,
        color: [
          [0.3, '#e74c3c'],
          [0.7, '#f39c12'],
          [1, '#36ce9e']
        ]
      }
    },
    pointer: {
      itemStyle: {
        color: '#4fd6ff'
      }
    },
    axisTick: {
      distance: -8,
      length: 5,
      lineStyle: {
        color: '#ffffff'
      }
    },
    splitLine: {
      distance: -10,
      length: 8,
      lineStyle: {
        color: '#ffffff'
      }
    },
    axisLabel: {
      color: '#ffffff',
      distance: -15,
      fontSize: 10
    },
    detail: {
      valueAnimation: true,
      formatter: '{value}%',
      color: '#4fd6ff',
      fontSize: 20,
      offsetCenter: [0, '70%']
    },
    title: {
      show: true,
      offsetCenter: [0, '90%'],
      color: '#ffffff',
      fontSize: 14
    },
    data: [{
      value,
      name: title
    }]
  }]
})

// 水球图配置（用于显示完成度等）
export const getLiquidFillOption = (value: number, title: string) => ({
  ...commonConfig,
  title: {
    text: title,
    left: 'center',
    top: 20,
    textStyle: {
      color: '#4fd6ff',
      fontSize: 14,
      fontWeight: 'bold'
    }
  },
  series: [{
    type: 'liquidFill',
    data: [value / 100],
    radius: '70%',
    center: ['50%', '60%'],
    color: ['#4fd6ff', '#36ce9e'],
    backgroundStyle: {
      borderWidth: 1,
      borderColor: '#4fd6ff',
      color: 'rgba(79, 214, 255, 0.1)'
    },
    label: {
      formatter: `${value}%`,
      color: '#ffffff',
      fontSize: 20
    },
    outline: {
      show: true,
      borderDistance: 5,
      itemStyle: {
        borderWidth: 2,
        borderColor: '#4fd6ff'
      }
    }
  }]
})

export default {
  getStudentStatusPieOption,
  getMajorDistributionBarOption,
  getMonthlyTrendLineOption,
  getCourseTypeDonutOption,
  getResourceRadarOption,
  getDepartmentComparisonOption,
  getIndustryDistributionOption,
  getGaugeOption,
  getLiquidFillOption
} 