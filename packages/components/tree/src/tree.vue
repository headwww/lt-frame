<script lang="tsx">
import { Tree } from 'ant-design-vue';
import { computed, defineComponent } from 'vue';
import { treeProps } from './tree';

export default defineComponent({
	name: 'LtTree',
	props: treeProps,
	setup(props) {
		const treeData = computed(() => props.treeData);

		return () => <Tree treeData={treeData.value}></Tree>;
	},
});
</script>
