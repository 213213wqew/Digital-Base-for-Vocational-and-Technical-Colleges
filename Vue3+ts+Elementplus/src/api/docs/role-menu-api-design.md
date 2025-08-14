# 角色菜单API设计文档

本文档描述了角色菜单关联功能所需的后端API接口设计。

## 1. 获取角色菜单ID列表

此接口用于获取指定角色已分配的菜单ID列表。

### 请求

```
GET /api/menus/role/{roleId}/ids
```

### 参数

| 参数名 | 类型   | 说明   |
| ------ | ------ | ------ |
| roleId | String | 角色ID |

### 响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": ["1", "2", "3", "4", "5"]
}
```

## 2. 分配角色菜单

此接口用于为指定角色分配菜单权限。

### 请求

```
POST /api/system/roles/{roleId}/menus
```

### 参数

| 参数名  | 类型         | 说明       |
| ------- | ------------ | ---------- |
| roleId  | String       | 角色ID     |
| menuIds | List<String> | 菜单ID列表 |

### 请求体示例

```json
{
  "menuIds": ["1", "2", "3", "4", "5"]
}
```

### 响应

```json
{
  "code": 200,
  "message": "操作成功",
  "data": true
}
```

## 3. 后端实现建议

### 角色菜单接口控制器

```java
@Tag(name = "角色菜单管理", description = "角色菜单关联相关接口")
@RestController
@RequestMapping("/api/system/roles")
public class RoleMenuController {

    @Autowired
    private RoleMenuService roleMenuService;

    /**
     * 分配角色菜单
     */
    @Operation(summary = "分配角色菜单")
    @PostMapping("/{roleId}/menus")
    public Result<Boolean> assignRoleMenus(
            @Parameter(description = "角色ID") @PathVariable String roleId,
            @RequestBody Map<String, List<String>> params) {
        try {
            List<String> menuIds = params.get("menuIds");
            if (menuIds == null) {
                return Result.failed("菜单ID列表不能为空");
            }
            boolean success = roleMenuService.assignRoleMenus(roleId, menuIds);
            if (success) {
                return Result.success("分配成功", true);
            } else {
                return Result.failed("分配失败");
            }
        } catch (Exception e) {
            return Result.failed("分配角色菜单失败：" + e.getMessage());
        }
    }
}
```

### 菜单接口控制器扩展

```java
@RestController
@RequestMapping("/api/menus")
public class MenuController {

    // 现有代码...

    /**
     * 根据角色ID获取菜单ID列表
     */
    @Operation(summary = "根据角色ID获取菜单ID列表")
    @GetMapping("/role/{roleId}/ids")
    public Result<List<String>> getMenuIdsByRoleId(@PathVariable String roleId) {
        try {
            List<String> menuIds = menuService.getMenuIdsByRoleId(roleId);
            return Result.success(menuIds);
        } catch (Exception e) {
            return Result.failed(e.getMessage());
        }
    }
}
```

### 角色菜单服务接口

```java
public interface RoleMenuService {

    /**
     * 分配角色菜单
     *
     * @param roleId 角色ID
     * @param menuIds 菜单ID列表
     * @return 是否成功
     */
    boolean assignRoleMenus(String roleId, List<String> menuIds);
}
```

### 菜单服务接口扩展

```java
public interface MenuService extends IService<SystemMenu> {

    // 现有代码...

    /**
     * 根据角色ID获取菜单ID列表
     *
     * @param roleId 角色ID
     * @return 菜单ID列表
     */
    List<String> getMenuIdsByRoleId(String roleId);
}
```

### 服务实现类

```java
@Service
public class RoleMenuServiceImpl implements RoleMenuService {

    @Autowired
    private RoleMenuMapper roleMenuMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean assignRoleMenus(String roleId, List<String> menuIds) {
        // 先删除该角色所有菜单关联
        roleMenuMapper.deleteByRoleId(roleId);

        // 如果菜单ID列表为空，则只做删除操作
        if (menuIds == null || menuIds.isEmpty()) {
            return true;
        }

        // 批量插入新的角色菜单关联
        List<SystemRoleMenu> roleMenus = menuIds.stream()
                .map(menuId -> {
                    SystemRoleMenu roleMenu = new SystemRoleMenu();
                    roleMenu.setRoleId(roleId);
                    roleMenu.setMenuId(menuId);
                    // 设置其他必要字段，如ID生成等
                    return roleMenu;
                }).collect(Collectors.toList());

        return roleMenuMapper.batchInsert(roleMenus) > 0;
    }
}
```

```java
@Service
public class MenuServiceImpl extends ServiceImpl<MenuMapper, SystemMenu> implements MenuService {

    // 现有代码...

    @Override
    public List<String> getMenuIdsByRoleId(String roleId) {
        return menuMapper.selectMenuIdsByRoleId(roleId);
    }
}
```

### 数据访问层扩展

```java
@Mapper
public interface RoleMenuMapper extends BaseMapper<SystemRoleMenu> {

    /**
     * 根据角色ID删除角色菜单关联
     *
     * @param roleId 角色ID
     * @return 影响行数
     */
    int deleteByRoleId(@Param("roleId") String roleId);

    /**
     * 批量插入角色菜单关联
     *
     * @param roleMenus 角色菜单关联列表
     * @return 影响行数
     */
    int batchInsert(List<SystemRoleMenu> roleMenus);
}
```

```java
@Mapper
public interface MenuMapper extends BaseMapper<SystemMenu> {

    // 现有代码...

    /**
     * 根据角色ID查询菜单ID列表
     *
     * @param roleId 角色ID
     * @return 菜单ID列表
     */
    List<String> selectMenuIdsByRoleId(@Param("roleId") String roleId);
}
```

### SQL映射文件扩展

```xml
<!-- RoleMenuMapper.xml -->
<mapper namespace="com.rbac.admin.mapper.system.RoleMenuMapper">
    <delete id="deleteByRoleId">
        DELETE FROM sys_role_menu WHERE role_id = #{roleId}
    </delete>

    <insert id="batchInsert">
        INSERT INTO sys_role_menu (id, role_id, menu_id, create_time) VALUES
        <foreach collection="list" item="item" separator=",">
            (#{item.id}, #{item.roleId}, #{item.menuId}, #{item.createTime})
        </foreach>
    </insert>
</mapper>
```

```xml
<!-- MenuMapper.xml -->
<mapper namespace="com.rbac.admin.mapper.system.MenuMapper">
    <!-- 现有SQL映射... -->

    <select id="selectMenuIdsByRoleId" resultType="java.lang.String">
        SELECT menu_id
        FROM sys_role_menu
        WHERE role_id = #{roleId}
    </select>
</mapper>
```
