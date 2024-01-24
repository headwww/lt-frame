export const svgIconProps = {
	prefix: {
		type: String,
		default: 'icon',
	},
	name: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		default: '',
	},
	size: {
		type: [Number, String],
		default: 16,
	},
	spin: {
		type: Boolean,
		default: false,
	},
};
