import { z } from 'zod';

export const zRoleType = z
	.object({
		id: z
			.string({
				// eslint-disable-next-line camelcase
				required_error: 'You need to insert the id of the member',
			})
			.regex(/\d+/),

		remove_roles: z.string({
			// eslint-disable-next-line camelcase
			required_error: 'You need to insert Roles to remove',
		}),
		add_roles: z.string({
			// eslint-disable-next-line camelcase
			required_error: 'You need to insert Roles to Add',
		}),
	})
	.strict();

export type RoleType = z.infer<typeof zRoleType>;
