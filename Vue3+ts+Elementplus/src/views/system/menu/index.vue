<template>
  <div class="menu-container">
    <!-- 搜索区域 -->
    <!-- <el-card class="search-card">
      <el-form :inline="true" :model="queryParams" class="menu-search-form">
        <el-form-item label="菜单名称">
          <el-input v-model="queryParams.name" placeholder="请输入菜单名称" clearable style="width: 220px;" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-select v-model="queryParams.type" placeholder="请选择菜单类型" clearable style="width: 220px;">
            <el-option label="目录" :value="1" />
            <el-option label="菜单" :value="2" />
            <el-option label="按钮" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 220px;">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon>
            <span>重置</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card> -->

    <!-- 表格区域 -->
    <el-card class="table-card">
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" @click="() => handleAdd()">
            <el-icon><Plus /></el-icon>
            <span>新增</span>
          </el-button>
        </div>
        <div class="header-title">菜单列表</div>
        <div class="placeholder"></div>
      </div>
      <el-table
        v-loading="loading"
        :data="filterMenuList"
        row-key="id"
        border
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children' }"
        :indent="32"
        :row-class-name="getRowClassName"
        @selection-change="handleSelectionChange"
        class="menu-table"
        draggable
        @row-drop="handleRowDrop"
        height="calc(100vh - 260px)"
        :header-row-class-name="'fixed-header'"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column prop="name" label="菜单名称" min-width="420">
          <template #default="{ row }">
            <div
              class="menu-name"
              :style="{ marginLeft: getMenuLevel(row) * 24 + 'px' }"
            >
              <div v-if="row.icon" class="menu-icon-wrapper">
                <el-icon class="menu-icon">
                  <component :is="getIconComponent(row.icon)" />
                </el-icon>
              </div>
              <span :class="getMenuTextClass(row)">
                {{ row.name }}
              </span>
              <el-tag
                v-if="getMenuLevel(row) > 0"
                size="small"
                type="info"
                class="level-tag"
              >
                L{{ getMenuLevel(row) }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="60" align="center" />
        <el-table-column prop="path" label="路由地址" min-width="180" />
        <el-table-column prop="component" label="组件路径" min-width="180" />
        <el-table-column prop="type" label="类型" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              v-if="row.type === 1 || row.type === 'catalog'"
              type="warning"
              size="small"
              >目录</el-tag
            >
            <el-tag
              v-else-if="row.type === 2 || row.type === 'menu'"
              type="success"
              size="small"
              >菜单</el-tag
            >
            <el-tag
              v-else-if="row.type === 3 || row.type === 'button'"
              type="info"
              size="small"
              >按钮</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限标识" min-width="150" />
        <el-table-column
          prop="visible"
          label="显示状态"
          width="90"
          align="center"
        >
          <template #default="{ row }">
            <el-tag v-if="row.visible === 1" type="success" size="small"
              >显示</el-tag
            >
            <el-tag v-else-if="row.visible === 0" type="info" size="small"
              >隐藏</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success" size="small"
              >正常</el-tag
            >
            <el-tag v-else-if="row.status === 0" type="danger" size="small"
              >停用</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="() => handleEdit(row)"
              style="padding: 4px 6px; font-size: 12px"
              >编辑</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="() => handleDelete(row)"
              style="padding: 4px 6px; font-size: 12px"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 菜单表单对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuFormRules"
        label-width="120px"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuOptions"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            value-key="id"
            placeholder="请选择上级菜单"
            check-strictly
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menuForm.type">
            <el-radio :value="1">目录</el-radio>
            <el-radio :value="2">菜单</el-radio>
            <el-radio :value="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 3" label="菜单图标" prop="icon">
          <el-input
            v-model="menuForm.icon"
            placeholder="点击选择图标"
            readonly
            @click="showIconDialog = true"
          >
            <template #prefix>
              <el-icon v-if="menuForm.icon">
                <component :is="getIconComponent(menuForm.icon)" />
              </el-icon>
            </template>
            <template #suffix>
              <el-button link type="primary" @click="showIconDialog = true">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input
            v-model="menuForm.name"
            style="width: 800px"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="menuForm.sort"
            :min="0"
            :max="999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 3" label="路由地址" prop="path">
          <el-input
            v-model="menuForm.path"
            placeholder="目录和菜单必须填写路由地址"
          />
          <div class="form-tip" v-if="menuForm.type === 1">
            <el-alert
              title="目录类型的路由地址推荐以/开头，例如: /system"
              type="info"
              :closable="false"
              size="small"
            />
          </div>
          <div class="form-tip" v-else-if="menuForm.type === 2">
            <el-alert
              title="菜单类型的路由地址不需要以/开头，例如: user"
              type="info"
              :closable="false"
              size="small"
            />
          </div>
        </el-form-item>
        <el-form-item
          v-if="menuForm.type === 2"
          label="组件路径"
          prop="component"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
          <div class="form-tip">
            <el-alert
              title="组件路径格式: system/user/index 或 views/system/user/index"
              type="info"
              :closable="false"
              size="small"
            />
          </div>
        </el-form-item>
        <el-form-item
          v-if="menuForm.type !== 3"
          label="显示状态"
          prop="visible"
        >
          <el-radio-group v-model="menuForm.visible">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 3" label="菜单状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="menuForm.type === 2"
          label="是否缓存"
          prop="isCache"
        >
          <el-radio-group v-model="menuForm.isCache">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="menuForm.type === 2"
          label="是否外链"
          prop="isFrame"
        >
          <el-radio-group v-model="menuForm.isFrame">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="menuForm.type !== 1"
          label="权限标识"
          prop="permission"
        >
          <el-input
            v-model="menuForm.permission"
            placeholder="请输入权限标识"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="menuForm.remark"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图标选择器弹窗 -->
    <el-dialog
      title="选择图标"
      v-model="showIconDialog"
      width="900px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      class="icon-dialog"
    >
      <div class="icon-selector-container">
        <!-- 顶部搜索和统计 -->
        <div class="selector-header">
          <div class="search-box">
            <el-input
              v-model="iconSearchKeyword"
              placeholder="搜索图标..."
              clearable
              size="large"
              class="search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="stats-info">
            <span v-if="!iconSearchKeyword">
              {{ selectedIconCategory }} · {{ filteredIcons.length }} 个图标
            </span>
            <span v-else> 搜索结果 · {{ filteredIcons.length }} 个匹配 </span>
          </div>
        </div>

        <!-- 分类筛选 -->
        <div class="category-filters" v-if="!iconSearchKeyword">
          <el-button
            v-for="category in Object.keys(categorizedIcons)"
            :key="category"
            :type="selectedIconCategory === category ? 'primary' : ''"
            :plain="selectedIconCategory !== category"
            size="small"
            class="category-btn"
            @click="selectedIconCategory = category"
          >
            {{ category }}
            <el-tag size="small" class="count-tag">
              {{
                categorizedIcons[category as keyof typeof categorizedIcons]
                  .length
              }}
            </el-tag>
          </el-button>
        </div>

        <!-- 图标网格 - 表格形式 -->
        <div class="icons-grid-wrapper">
          <div class="icons-grid-table" v-if="filteredIcons.length > 0">
            <div
              v-for="icon in filteredIcons"
              :key="icon"
              class="icon-cell"
              :class="{ selected: menuForm.icon === icon }"
              @click="selectIcon(icon)"
              :title="icon"
            >
              <el-icon class="icon-element">
                <component :is="getIconComponent(icon)" />
              </el-icon>
              <span class="icon-label">{{ icon }}</span>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <el-empty description="没有找到匹配的图标">
              <template #image>
                <el-icon size="64" color="#d0d7de"><Search /></el-icon>
              </template>
            </el-empty>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showIconDialog = false" size="large"
            >取消</el-button
          >
          <el-button type="primary" @click="confirmSelectIcon" size="large"
            >确定选择</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { Search, Refresh, Plus } from "@element-plus/icons-vue";
import * as ElementPlusIcons from "@element-plus/icons-vue";
import { menuApi } from "@/api/menu";
import type { MenuItem, MenuQueryParams } from "@/types/menu";

// 注册所有Element Plus图标组件
const iconMap = ElementPlusIcons;

// 获取图标组件
const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap];
};

// 查询参数
const queryParams = reactive<MenuQueryParams>({
  name: "",
  type: undefined,
  status: undefined,
  parentId: undefined, // 替换roleId为parentId
});

// 表格数据
const menuList = ref<MenuItem[]>([]);
const loading = ref(false);
const selectedMenus = ref<MenuItem[]>([]);
const isExpandAll = ref(true);

// 过滤后的菜单列表
const filterMenuList = computed(() => {
  if (
    !queryParams.name &&
    !queryParams.type &&
    queryParams.status === undefined
  ) {
    return menuList.value;
  }

  // 递归过滤树形结构
  const filterTree = (tree: MenuItem[]): MenuItem[] => {
    return tree.filter((node) => {
      // 应用过滤条件
      const nameMatch =
        !queryParams.name || node.name.includes(queryParams.name);

      // 类型匹配，同时支持字符串和数字类型
      let typeMatch = true;
      if (queryParams.type !== undefined) {
        if (typeof queryParams.type === "number") {
          // 数字类型比较
          typeMatch =
            node.type === queryParams.type ||
            (queryParams.type === 1 && node.type === "catalog") ||
            (queryParams.type === 2 && node.type === "menu") ||
            (queryParams.type === 3 && node.type === "button");
        } else {
          // 字符串类型比较
          typeMatch =
            node.type === queryParams.type ||
            (queryParams.type === "catalog" && node.type === 1) ||
            (queryParams.type === "menu" && node.type === 2) ||
            (queryParams.type === "button" && node.type === 3);
        }
      }

      const statusMatch =
        queryParams.status === undefined || node.status === queryParams.status;

      const matched = nameMatch && typeMatch && statusMatch;

      // 如果当前节点有子节点，递归过滤
      if (node.children && node.children.length > 0) {
        const filteredChildren = filterTree(node.children);

        // 复制一个新对象，避免修改原始数据
        node.children = filteredChildren;

        // 如果子节点有匹配的，或当前节点匹配，则保留
        return filteredChildren.length > 0 || matched;
      }

      // 叶子节点直接返回匹配结果
      return matched;
    });
  };

  return filterTree(menuList.value);
});

// 对话框配置
const dialog = reactive({
  visible: false,
  title: "",
  isEdit: false,
});

// 图标选择器弹窗状态
const showIconDialog = ref(false);

// 表单数据
const menuFormRef = ref<FormInstance>();
const menuForm = reactive<Partial<MenuItem>>({
  id: "",
  name: "",
  path: "",
  component: "",
  icon: "",
  type: 2, // 使用数字类型 (2=菜单)
  sort: 0,
  visible: 1,
  status: 1,
  isCache: 0,
  isFrame: 0,
  permission: "",
  parentId: "",
  remark: "",
});

// 表单验证规则
const menuFormRules = {
  name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  type: [{ required: true, message: "菜单类型不能为空", trigger: "change" }],
  // path: [
  //   {
  //     required: true,
  //     message: '路由地址不能为空',
  //     trigger: 'blur',
  //     validator: (_: any, value: string, callback: any) => {
  //       if ((menuForm.type === 2 || menuForm.type === 1) && !value) {
  //         callback(new Error('菜单类型的路由地址不能为空'))
  //       } else {
  //         callback()
  //       }
  //     }
  //   }
  // ],
  component: [
    {
      required: true,
      message: "组件路径不能为空",
      trigger: "blur",
      validator: (_: any, value: string, callback: any) => {
        if (menuForm.type === 2 && !value) {
          callback(new Error("组件路径不能为空"));
        } else {
          callback();
        }
      },
    },
  ],
};

// 分类图标列表，便于查找
const categorizedIcons = {
  常用: [
    "Menu",
    "HomeFilled",
    "User",
    "Setting",
    "Location",
    "Document",
    "Folder",
    "Files",
    "Grid",
    "List",
    "Monitor",
    "DataAnalysis",
  ],
  系统: [
    "User",
    "UserFilled",
    "Avatar",
    "Lock",
    "Key",
    "Shield",
    "Tools",
    "Setting",
    "Operation",
    "Management",
    "SwitchButton",
    "Postcard",
  ],
  导航: [
    "Menu",
    "Guide",
    "Location",
    "Position",
    "Promotion",
    "TrendCharts",
    "Histogram",
    "PieChart",
    "DataBoard",
    "DataLine",
    "Monitor",
    "Platform",
  ],
  文档: [
    "Document",
    "DocumentAdd",
    "DocumentCopy",
    "DocumentDelete",
    "Files",
    "Folder",
    "FolderAdd",
    "FolderOpened",
    "Notebook",
    "Reading",
    "EditPen",
  ],
  通信: [
    "Message",
    "MessageBox",
    "ChatDotRound",
    "ChatLineRound",
    "Bell",
    "BellFilled",
    "Phone",
    "PhoneFilled",
    "Microphone",
    "Promotion",
  ],
  商务: [
    "Shop",
    "ShoppingBag",
    "ShoppingCart",
    "Goods",
    "Box",
    "Van",
    "Coin",
    "Money",
    "CreditCard",
    "Wallet",
    "Present",
    "Trophy",
  ],
  媒体: [
    "Picture",
    "PictureFilled",
    "Camera",
    "CameraFilled",
    "VideoCamera",
    "VideoCameraFilled",
    "Headset",
    "Film",
    "VideoPlay",
    "View",
  ],
  统计: [
    "DataAnalysis",
    "DataBoard",
    "TrendCharts",
    "Histogram",
    "PieChart",
    "LineChart",
    "Grid",
    "List",
    "Tickets",
    "Flag",
  ],
  其他: [
    "Star",
    "StarFilled",
    "Link",
    "Connection",
    "Compass",
    "MapLocation",
    "Timer",
    "AlarmClock",
    "Calendar",
    "Clock",
    "Sunset",
    "Sunrise",
    "SuccessFilled",
    "WarningFilled",
    "InfoFilled",
    "CircleCheckFilled",
  ],
};

// 当前选中的图标分类
const selectedIconCategory = ref("常用");

// 图标搜索关键词
const iconSearchKeyword = ref("");

// 过滤后的图标列表
const filteredIcons = computed(() => {
  let icons =
    categorizedIcons[
      selectedIconCategory.value as keyof typeof categorizedIcons
    ] || [];

  if (iconSearchKeyword.value) {
    // 搜索时在所有图标中查找
    const allIcons = Object.values(categorizedIcons).flat();
    icons = allIcons.filter((icon) =>
      icon.toLowerCase().includes(iconSearchKeyword.value.toLowerCase()),
    );
  }

  return icons;
});

// 下拉树形菜单选项
const menuOptions = ref<any[]>([]);

// 获取菜单列表
const getMenuList = async () => {
  loading.value = true;
  try {
    // 获取后端已经构建好的树形结构数据
    const data = await menuApi.getMenuList();
    // 打印原始数据，查看结构
    // 输出层级信息
    const levelInfo = (items: MenuItem[], level = 0) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          levelInfo(item.children, level + 2);
        }
      });
    };
    levelInfo(data);
    // 直接使用后端返回的树形结构数据
    menuList.value = data;
    // 更新菜单选项（用于上级菜单选择）
    updateMenuOptions();
  } catch (error) {
    ElMessage.error("获取菜单列表失败");
  } finally {
    loading.value = false;
  }
};

// 更新菜单选项（用于上级菜单选择）
const updateMenuOptions = () => {
  // 深拷贝菜单列表，添加一个顶级节点
  const options: any[] = [
    { id: "0", name: "顶级菜单", type: "catalog", children: [] },
  ];

  // 递归构建树形菜单选项，限制最大层级为3（这样可以添加第4级菜单）
  const buildMenuTree = (
    menus: MenuItem[],
    currentLevel: number = 0,
  ): any[] => {
    const result: any[] = [];

    menus.forEach((menu) => {
      // 只包含非按钮类型的菜单，且层级不超过3级
      if (menu.type !== "button" && menu.type !== 3 && currentLevel < 3) {
        const menuOption: any = {
          id: menu.id,
          name: menu.name,
          type: menu.type,
          children: [] as any[],
        };

        // 递归处理子菜单
        if (menu.children && menu.children.length > 0) {
          menuOption.children = buildMenuTree(menu.children, currentLevel + 1);
        }

        result.push(menuOption);
      }
    });

    return result;
  };

  // 构建完整的树形结构
  options[0].children = buildMenuTree(menuList.value, 0);
  menuOptions.value = options;

  console.log("菜单选项构建完成，支持层级:", menuOptions.value);
};

// 重置查询
const resetQuery = () => {
  queryParams.name = "";
  queryParams.type = undefined;
  queryParams.status = undefined;
  queryParams.parentId = undefined;

  // 重置后立即查询
  handleQuery();
};

// 处理查询
const handleQuery = () => {
  loading.value = true;
  try {
    // 复制查询参数，避免直接修改原始对象
    const params: Record<string, any> = {};

    // 只包含非空值
    if (queryParams.name) params.name = queryParams.name;
    if (queryParams.type !== undefined) params.type = queryParams.type;
    if (queryParams.status !== undefined) params.status = queryParams.status;
    if (queryParams.parentId) params.parentId = queryParams.parentId;

    console.log("查询参数:", params);

    // 使用queryMenuList方法进行查询
    menuApi
      .queryMenuList(params)
      .then((data) => {
        console.log("查询结果数据:", data);
        menuList.value = data;
        updateMenuOptions();
      })
      .finally(() => {
        loading.value = false;
      });
  } catch (error) {
    console.error("查询菜单列表失败:", error);
    ElMessage.error("查询菜单列表失败");
    loading.value = false;
  }
};

// 处理多选
const handleSelectionChange = (selection: MenuItem[]) => {
  selectedMenus.value = selection;
};

// 处理添加
const handleAdd = (row?: MenuItem) => {
  resetForm();
  dialog.title = "添加菜单";
  dialog.isEdit = false;

  if (row && row.id) {
    // 如果是在某个菜单下添加子菜单
    menuForm.parentId = row.id;

    // 获取父菜单的层级
    const parentLevel = getMenuLevel(row);
    console.log(
      "选中的父菜单:",
      row.name,
      "父菜单层级:",
      parentLevel,
      "父菜单类型:",
      row.type,
    );

    // 根据父菜单层级和类型，智能设置默认类型
    if (parentLevel === 0) {
      // 顶级菜单下，默认添加目录
      menuForm.type = 1; // 目录类型
      console.log("在顶级菜单下添加，设置为目录类型");
    } else if (parentLevel === 1) {
      // 一级菜单下，默认添加菜单
      menuForm.type = 2; // 菜单类型
      console.log("在一级菜单下添加，设置为菜单类型");
    } else if (parentLevel === 2) {
      // 二级菜单下，默认添加菜单或按钮
      menuForm.type = row.type === 1 ? 2 : 3; // 如果父级是目录则添加菜单，否则添加按钮
      console.log("在二级菜单下添加，设置类型为:", menuForm.type);
    } else if (parentLevel === 3) {
      // 三级菜单下，默认添加按钮
      menuForm.type = 3; // 按钮类型
      console.log("在三级菜单下添加，设置为按钮类型");
    } else {
      // 四级及以上，只能添加按钮
      menuForm.type = 3; // 按钮类型
      console.log("在四级及以上菜单下添加，只能设置为按钮类型");
    }
  } else {
    // 如果是顶级菜单，默认类型为目录
    menuForm.type = 1; // 目录类型
    console.log("添加顶级菜单，设置为目录类型");
  }

  console.log(
    "新增菜单最终类型:",
    menuForm.type,
    "父菜单ID:",
    menuForm.parentId,
  );
  dialog.visible = true;
};

// 处理编辑
const handleEdit = (row: MenuItem) => {
  resetForm();
  dialog.title = "编辑菜单";
  dialog.isEdit = true;

  nextTick(() => {
    // 填充表单数据
    Object.assign(menuForm, row);
    dialog.visible = true;
  });
};

// 处理删除
const handleDelete = async (row: MenuItem) => {
  const hasChildren = row.children && row.children.length > 0;

  if (hasChildren) {
    ElMessage.warning("该菜单下存在子菜单，无法直接删除");
    return;
  }

  try {
    await ElMessageBox.confirm(`确定要删除菜单 "${row.name}" 吗？`, "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });

    const success = await menuApi.deleteMenu(Number(row.id));
    if (success) {
      ElMessage.success("删除成功");
      getMenuList();
    } else {
      ElMessage.error("删除失败");
    }
  } catch (error) {
    console.log("取消删除");
  }
};

// 选择图标
const selectIcon = (icon: string) => {
  menuForm.icon = icon;
};

// 确认选择图标
const confirmSelectIcon = () => {
  showIconDialog.value = false;
  // 清空搜索关键词
  iconSearchKeyword.value = "";
  // 重置分类
  selectedIconCategory.value = "常用";
};

// 重置表单
const resetForm = () => {
  if (menuFormRef.value) {
    menuFormRef.value.resetFields();
  }

  menuForm.id = "";
  menuForm.name = "";
  menuForm.path = "";
  menuForm.component = "";
  menuForm.icon = "";
  menuForm.type = 2; // 使用数字类型 (2=菜单)
  menuForm.sort = 0;
  menuForm.visible = 1;
  menuForm.status = 1;
  menuForm.isCache = 0;
  menuForm.isFrame = 0;
  menuForm.permission = "";
  menuForm.parentId = "";
  menuForm.remark = "";
};

// 提交表单
const submitForm = async () => {
  if (!menuFormRef.value) return;

  try {
    await menuFormRef.value.validate();

    // 确保菜单类型是数字
    if (typeof menuForm.type === "string") {
      if (menuForm.type === "catalog") menuForm.type = 1;
      else if (menuForm.type === "menu") menuForm.type = 2;
      else if (menuForm.type === "button") menuForm.type = 3;
    }

    // 再次检查转换后的类型

    if (dialog.isEdit) {
      // 编辑菜单
      await menuApi.updateMenu(Number(menuForm.id), menuForm);
      ElMessage.success("修改成功");
    } else {
      // 添加菜单
      await menuApi.createMenu(menuForm as Omit<MenuItem, "id">);
      ElMessage.success("添加成功");
    }

    dialog.visible = false;
    getMenuList();
  } catch (error) {
    console.error("表单提交失败:", error);
  }
};

// 处理行拖拽
const handleRowDrop = async (event: any) => {
  const { oldData } = event;

  if (oldData.children && oldData.children.length > 0) {
    ElMessage.warning("不能拖拽包含子菜单的菜单");
    return;
  }

  try {
    // 更新排序字段
    const draggingItem = { ...oldData };

    await ElMessageBox.confirm("确定要移动该菜单吗？", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });

    const success = await menuApi.updateMenu(Number(draggingItem.id), {
      sort: draggingItem.sort,
    });

    if (success) {
      ElMessage.success("菜单排序更新成功");
      getMenuList(); // 刷新列表
    } else {
      ElMessage.error("菜单排序更新失败");
    }
  } catch (error) {
    console.log("取消移动");
  }
};

// 监听表单类型变化，确保类型为数字
watch(
  () => menuForm.type,
  (newVal) => {
    // 如果类型是字符串，转换为数字
    if (typeof newVal === "string") {
      if (newVal === "catalog") menuForm.type = 1;
      else if (newVal === "menu") menuForm.type = 2;
      else if (newVal === "button") menuForm.type = 3;
    }
  },
);

// 初始化
onMounted(() => {
  getMenuList();
});

// 获取菜单文本类
const getMenuTextClass = (row: MenuItem) => {
  const level = getMenuLevel(row);
  if (level === 1) return "level-1-text";
  if (level === 2) return "level-2-text";
  if (level === 3) return "level-3-text";
  if (level === 4) return "level-4-text";
  return "";
};

// 计算菜单层级（递归查找父级）
const getMenuLevel = (menu: MenuItem): number => {
  if (!menu.parentId || menu.parentId === "0") {
    return 0; // 顶级菜单
  }

  // 在当前菜单列表中查找父菜单
  const findParent = (menus: MenuItem[], targetId: string): MenuItem | null => {
    for (const item of menus) {
      if (item.id === targetId) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const found = findParent(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const parent = findParent(menuList.value, menu.parentId);
  if (!parent) {
    return 1; // 如果找不到父菜单，默认为1级
  }

  return getMenuLevel(parent) + 1;
};

// 获取行类名
const getRowClassName = ({ row }: { row: MenuItem }) => {
  const level = getMenuLevel(row);
  if (level === 1) return "level-1-row";
  if (level === 2) return "level-2-row";
  if (level === 3) return "level-3-row";
  if (level === 4) return "level-4-row";
  return "";
};
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 0px;

  .search-card {
    margin-bottom: 5px;

    /* 搜索表单样式优化 */
    .menu-search-form {
      display: flex;
      flex-wrap: wrap;

      .el-form-item {
        margin-right: 18px;
        margin-bottom: 15px;

        .el-form-item__label {
          font-weight: 500;
          padding-right: 10px;
        }
      }

      .el-button {
        margin-right: 10px;
      }
    }
  }

  .action-container {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    margin: 15px 0;

    .el-button {
      padding: 8px 16px;

      .el-icon {
        margin-right: 4px;
      }
    }
  }

  .table-card {
    margin-bottom: 0px;
  }

  /* 菜单表格样式 */
  .menu-table {
    margin-bottom: 0px;

    /* 调整表头样式 */
    :deep(.el-table__header-wrapper) {
      .el-table__header {
        th {
          padding: 4px 0;
          height: 40px;
        }
      }
    }

    /* 固定表头样式 */
    :deep(.fixed-header) {
      background-color: #f8f9fa !important;
      font-weight: 600 !important;
      color: #495057 !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 10 !important;
      border-bottom: 2px solid #dee2e6 !important;
    }

    /* 表格滚动区域样式 */
    :deep(.el-table__body-wrapper) {
      overflow-y: auto !important;
      scrollbar-width: thin;
      scrollbar-color: #c1c1c1 #f1f1f1;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;

        &:hover {
          background: #a8a8a8;
        }
      }
    }

    /* 树形结构样式优化 */
    :deep(.el-table__row) {
      transition: background-color 0.2s;
      height: 40px; /* 进一步减小行高 */

      &:hover {
        background-color: #f5f7fa;
      }
    }

    /* 类型列和状态列的标签调整 */
    :deep(.el-tag) {
      height: 22px;
      line-height: 20px;
      padding: 0 6px;
      font-size: 12px;
    }

    /* 强制树形结构缩进 - 关键修复 */
    :deep(.el-table__indent) {
      width: 32px !important;
      display: inline-block !important;
    }

    /* 确保展开图标正确显示 */
    :deep(.el-table__expand-icon) {
      margin-right: 8px !important;
      font-size: 14px;
      position: relative;
      top: 1px;
      vertical-align: middle;

      .el-icon {
        transition: transform 0.2s;
      }
    }

    /* 修复第一列的缩进问题 */
    :deep(.el-table__body-wrapper) {
      .el-table__row {
        td:first-child {
          .cell {
            display: flex !important;
            align-items: center !important;
            padding-left: 8px !important;
          }
        }
      }
    }

    /* 确保菜单名称列的内容正确缩进 */
    :deep(.el-table__body) {
      .el-table__row {
        .cell {
          padding: 2px 8px; /* 减小单元格内边距 */
          vertical-align: middle;
          display: flex;
          align-items: center;
        }
      }
    }

    /* 菜单名称样式 */
    .menu-name {
      display: flex;
      align-items: center;
      gap: 6px; /* 减小图标与文字间距 */
      white-space: nowrap;

      /* 菜单图标容器 */
      .menu-icon-wrapper {
        width: 24px; /* 减小图标容器大小 */
        height: 24px; /* 减小图标容器大小 */
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border: 1px solid #e2e8f0;
        border-radius: 6px; /* 减小圆角 */
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        .menu-icon {
          font-size: 12px; /* 减小图标大小 */
          color: #64748b;
          transition: color 0.3s ease;
        }

        &:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);

          .menu-icon {
            color: white;
          }
        }
      }

      /* 子菜单文字样式 */
      .submenu-text {
        color: #606266;
        font-size: 13px; /* 减小字体大小 */
        margin-left: 2px; /* 子菜单文字额外缩进 */
      }

      /* 多级菜单名称样式 */
      .level-1-text {
        color: #606266;
        font-size: 13px; /* 减小字体大小 */
        margin-left: 2px;
      }

      .level-2-text {
        color: #707070;
        font-size: 12px; /* 减小字体大小 */
        margin-left: 4px;
        font-style: italic;
      }

      .level-3-text {
        color: #808080;
        font-size: 11px; /* 减小字体大小 */
        margin-left: 6px;
        font-style: italic;
      }

      .level-4-text {
        color: #909090;
        font-size: 11px;
        margin-left: 8px;
        font-style: italic;
      }

      /* 层级标签样式 */
      .level-tag {
        margin-left: 6px;
        font-size: 10px;
        height: 16px;
        line-height: 14px;
        opacity: 0.7;
        padding: 0 4px;
      }
    }

    /* 子菜单行样式 - 支持4级菜单 */
    :deep(.el-table__row--level-1) {
      background-color: #f8f8f9;
    }

    :deep(.el-table__row--level-2) {
      background-color: #f2f4f6;
    }

    :deep(.el-table__row--level-3) {
      background-color: #eef1f4;
    }

    :deep(.el-table__row--level-4) {
      background-color: #e8ecf0;
    }
  }

  /* 图标选择器弹窗样式 */
  .icon-dialog {
    :deep(.el-dialog) {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    :deep(.el-dialog__header) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 24px;
      margin: 0;
      border-bottom: none;

      .el-dialog__title {
        font-size: 18px;
        font-weight: 600;
      }

      .el-dialog__headerbtn {
        top: 20px;
        right: 20px;

        .el-dialog__close {
          color: white;
          font-size: 20px;
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
      background: #f8fafc;
    }

    :deep(.el-dialog__footer) {
      background: white;
      border-top: 1px solid #e2e8f0;
      padding: 16px 24px;
      margin: 0;
    }
  }

  .icon-selector-container {
    padding: 24px;

    .selector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .search-box {
        flex: 1;
        max-width: 400px;

        .search-input {
          :deep(.el-input__wrapper) {
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            background: white;

            &:hover {
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            }

            &.is-focus {
              box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
              border-color: #667eea;
            }
          }
        }
      }

      .stats-info {
        font-size: 14px;
        color: #64748b;
        background: linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%);
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid #e2e8f0;
        font-weight: 500;
        white-space: nowrap;
      }
    }

    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
      padding: 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      .category-btn {
        border-radius: 24px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        .count-tag {
          margin-left: 6px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: inherit;
        }

        &.el-button--primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);

          .count-tag {
            background: rgba(255, 255, 255, 0.25);
            color: white;
          }
        }

        &:not(.el-button--primary):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
      }
    }

    .icons-grid-wrapper {
      max-height: 500px;
      overflow-y: auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      .icons-grid-table {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 2px;
        padding: 2px;
        background-color: #e2e8f0;
        border: 1px solid #e2e8f0;

        .icon-cell {
          width: 100px;
          height: 80px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 4px;

          &:hover {
            background-color: #f0f9ff;
            border-color: #0ea5e9;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);

            .icon-element {
              color: #0ea5e9;
              transform: scale(1.15);
            }

            .icon-label {
              color: #0ea5e9;
              font-weight: 500;
            }
          }

          &.selected {
            background-color: #0ea5e9;
            border-color: #0ea5e9;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);

            .icon-element {
              color: white;
              transform: scale(1.15);
            }

            .icon-label {
              color: white;
              font-weight: 600;
            }
          }

          .icon-element {
            font-size: 24px;
            color: #64748b;
            transition: all 0.2s ease;
            margin-bottom: 4px;
          }

          .icon-label {
            font-size: 11px;
            color: #64748b;
            text-align: center;
            line-height: 1.2;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: all 0.2s ease;
          }
        }
      }

      .empty-state {
        padding: 60px 20px;
        text-align: center;

        :deep(.el-empty) {
          .el-empty__image {
            margin-bottom: 20px;
          }

          .el-empty__description {
            color: #64748b;
            font-size: 16px;
          }
        }
      }

      /* 自定义滚动条 */
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
        border-radius: 4px;
        transition: background 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
        }
      }
    }
  }

  /* 对话框底部按钮样式 */
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .el-button {
      border-radius: 8px;
      padding: 12px 24px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:not(.el-button--primary) {
        background: #f8fafc;
        border-color: #e2e8f0;
        color: #64748b;

        &:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
      }

      &.el-button--primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }

  /* 表单提示样式 */
  .form-tip {
    margin-top: 5px;

    .el-alert {
      padding: 6px 10px;

      .el-alert__title {
        font-size: 12px;
        line-height: 1.2;
      }
    }
  }

  /* 调试信息样式 */
  .debug-info {
    margin-left: 8px;
    color: #909399;
    font-size: 12px;
  }
}
</style>

<!-- 添加全局样式以确保图标选择器样式正确应用 -->
<style>
/* 强制应用图标选择器样式 */
.el-dialog.icon-dialog {
  border-radius: 16px !important;
  overflow: hidden !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.el-dialog.icon-dialog .el-dialog__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  padding: 20px 24px !important;
  margin: 0 !important;
  border-bottom: none !important;
}

.el-dialog.icon-dialog .el-dialog__title {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: white !important;
}

.el-dialog.icon-dialog .el-dialog__headerbtn {
  top: 20px !important;
  right: 20px !important;
}

.el-dialog.icon-dialog .el-dialog__close {
  color: white !important;
  font-size: 20px !important;
}

.el-dialog.icon-dialog .el-dialog__body {
  padding: 0 !important;
  background: #f8fafc !important;
}

.el-dialog.icon-dialog .el-dialog__footer {
  background: white !important;
  border-top: 1px solid #e2e8f0 !important;
  padding: 16px 24px !important;
  margin: 0 !important;
}

/* 图标选择器内容强制样式 */
.icon-selector-container .category-btn.el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
}

.icon-selector-container .icons-grid-table {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
  gap: 2px !important;
  padding: 2px !important;
  background-color: #e2e8f0 !important;
  border: 1px solid #e2e8f0 !important;
}

.icon-selector-container .icon-cell {
  width: 100px !important;
  height: 80px !important;
  background: white !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  border: 1px solid transparent !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 8px 4px !important;
}

.icon-selector-container .icon-cell.selected {
  background-color: #0ea5e9 !important;
  border-color: #0ea5e9 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3) !important;
}

.icon-selector-container .icon-cell.selected .icon-element {
  color: white !important;
  transform: scale(1.15) !important;
}

.icon-selector-container .icon-cell.selected .icon-label {
  color: white !important;
  font-weight: 600 !important;
}

.icon-selector-container .icon-cell:hover:not(.selected) {
  background-color: #f0f9ff !important;
  border-color: #0ea5e9 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2) !important;
}

.icon-selector-container .icon-cell:hover:not(.selected) .icon-element {
  color: #0ea5e9 !important;
  transform: scale(1.15) !important;
}

.icon-selector-container .icon-cell:hover:not(.selected) .icon-label {
  color: #0ea5e9 !important;
  font-weight: 500 !important;
}

.icon-selector-container .icon-cell .icon-element {
  font-size: 24px !important;
  color: #64748b !important;
  transition: all 0.2s ease !important;
  margin-bottom: 4px !important;
}

.icon-selector-container .icon-cell .icon-label {
  font-size: 11px !important;
  color: #64748b !important;
  text-align: center !important;
  line-height: 1.2 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  transition: all 0.2s ease !important;
}
.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
/* 对话框按钮强制样式 */
.icon-dialog .dialog-footer .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

.icon-dialog .dialog-footer .el-button--primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4) !important;
}
</style>

<!-- 强制树形表格缩进样式 -->
<style scoped>
/* 强制树形表格缩进样式 - 最高优先级 */
.menu-table :deep(.el-table__indent) {
  width: 32px !important;
  display: inline-block !important;
  flex-shrink: 0 !important;
}

.menu-table :deep(.el-table__expand-icon) {
  margin-right: 8px !important;
  width: 16px !important;
  height: 16px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
}

.menu-table :deep(.el-table__cell .cell) {
  display: flex !important;
  align-items: center !important;
}

/* 确保树形结构的行背景色正确应用 */
.menu-table :deep(.level-1-row) > td {
  background-color: #f8f8f9 !important;
}

.menu-table :deep(.level-2-row) > td {
  background-color: #f2f4f6 !important;
}

.menu-table :deep(.level-3-row) > td {
  background-color: #eef1f4 !important;
}

.menu-table :deep(.level-4-row) > td {
  background-color: #e8ecf0 !important;
}

/* 悬停效果 */
.menu-table :deep(.level-1-row:hover) > td {
  background-color: #f1f5f9 !important;
}

.menu-table :deep(.level-2-row:hover) > td {
  background-color: #eef1f4 !important;
}

.menu-table :deep(.level-3-row:hover) > td {
  background-color: #e8ecf0 !important;
}

.menu-table :deep(.level-4-row:hover) > td {
  background-color: #e2e6ea !important;
}
</style>
