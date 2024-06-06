import { PropType, computed, defineComponent } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { isString } from 'lodash-es';
import { IPublicTypeTitleContent } from './types/title-config';

export default defineComponent({
	name: 'LcTitle',
	props: {
		title: [String, Object] as PropType<IPublicTypeTitleContent | string>,
	},
	setup(props) {
		const getClass = computed(() => {
			const { title } = props;

			if (title) {
				if (isString(title)) {
					return '';
				}
				const { tip } = title;
				if (tip) {
					return 'underline underline-dashed underline-coolgray cursor-help';
				}
			}
			return '';
		});

		const getTitleInfo = computed(() => {
			const { title } = props;
			if (title) {
				if (isString(title)) {
					return {
						label: title,
						tip: '',
					};
				}
				return title;
			}
			return {
				label: '',
				tip: '',
			};
		});
		return () => (
			<Tooltip title={getTitleInfo.value.tip}>
				<span class={getClass.value}>{getTitleInfo.value.label}</span>
			</Tooltip>
		);
	},
});
