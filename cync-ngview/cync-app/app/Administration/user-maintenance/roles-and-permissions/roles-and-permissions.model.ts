export class RoleModel{
	id: number;
	name: string;
    parent_role_id: any;
    description: string;
    role_type: string;
    system_defined: boolean;
}

export class PermissionModel{
	action_id: number;
	menu_id: number;
}
