<template>
	<div
		style="
			display: flex;
			width: 100%;
			height: 100%;
			background-image: radial-gradient(circle, #e0e6f8, #f7f9fd);
			border-radius: 12px;
			box-sizing: border-box;
			border: 1px solid #dedfdf;
		"
	>
		<div style="width: 300px">
			<div style="display: flex; margin-top: 14px">
				<div
					style="
						background-color: #ed6a5e;
						width: 12px;
						height: 12px;
						border-radius: 50%; /* 50% 确保圆形 */
						margin-left: 8px;
						border: 1px solid #d79894;
					"
				></div>
				<div
					style="
						background-color: #f5bd4f;
						width: 12px;
						height: 12px;
						border-radius: 50%; /* 50% 确保圆形 */
						margin-left: 8px;
						border: 1px solid #f5ad4f;
					"
				></div>
				<div
					style="
						background-color: #62c453;
						width: 12px;
						height: 12px;
						border-radius: 50%; /* 50% 确保圆形 */
						margin-left: 8px;
						border: 1px solid #62b453;
					"
				></div>
			</div>
			<div
				style="
					display: flex;
					width: 100%;
					height: calc(100% - 30px);
					overflow: auto;
					flex-direction: column;
					align-items: center;
				"
			>
				<slot name="left"></slot>
			</div>
		</div>

		<div
			style="
				width: 100%;
				flex: 1;
				display: flex;
				flex-direction: column;
				border-radius: 12px;
				border-bottom-left-radius: 0;
				border-top-right-radius: 0;
				margin-top: 20px;
				padding-left: 12px;
				padding-top: 12px;
				padding-bottom: 1px;
				background-color: #fff;
				box-shadow: 0 0 1px 1px #e0e6f8;
			"
		>
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script lang="ts" setup></script>
