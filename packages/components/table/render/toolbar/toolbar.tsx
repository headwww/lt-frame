import { VXETable } from 'vxe-table';
import { LTButton } from '../../../button';

VXETable.renderer.add('ToolbarToolPrint', {
	renderToolbarTool(_renderOpts, params) {
		const { $table } = params;
		return (
			<LTButton
				circle
				icon="vxe-icon-question-circle-fill"
				onClick={() => {
					$table.insert({});
				}}
			></LTButton>
		);
	},
});
