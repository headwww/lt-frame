<template>
	<LTPageLayout :dense="false" title="button组件的各种使用">
		<Row :gutter="[20, 20]">
			<Col :xl="10" :lg="24">
				<Card title="BasicButton Color">
					<div>
						<h3>success</h3>
						<div>
							<LTButton color="success"> 成功 </LTButton>
							<LTButton color="success" disabled> 禁用 </LTButton>
							<LTButton color="success" loading> loading </LTButton>
							<LTButton color="success" type="link"> link </LTButton>
							<LTButton color="success" type="link" loading>
								loading link
							</LTButton>
							<LTButton color="success" type="link" disabled>
								disabled link
							</LTButton>
						</div>
					</div>

					<div>
						<h3>warning</h3>
						<LTButton color="warning"> 警告 </LTButton>
						<LTButton color="warning" disabled> 禁用 </LTButton>
						<LTButton color="warning" loading> loading </LTButton>
						<LTButton color="warning" type="link"> link </LTButton>
						<LTButton color="warning" type="link" loading>
							loading link
						</LTButton>
						<LTButton color="warning" type="link" disabled>
							disabled link
						</LTButton>
					</div>

					<div>
						<h3>error</h3>
						<LTButton color="error"> 错误 </LTButton>
						<LTButton color="error" disabled> 禁用 </LTButton>
						<LTButton color="error" loading> loading </LTButton>
						<LTButton color="error" type="link"> link </LTButton>
						<LTButton color="error" type="link" loading>
							loading link
						</LTButton>
						<LTButton color="error" type="link" disabled>
							disabled link
						</LTButton>
					</div>

					<div>
						<h3>ghost</h3>
						<LTButton ghost color="success"> 幽灵成功 </LTButton>
						<LTButton ghost color="warning"> 幽灵警告 </LTButton>
						<LTButton ghost color="error"> 幽灵错误 </LTButton>
						<LTButton ghost type="dashed" color="warning">
							幽灵警告dashed
						</LTButton>
						<LTButton ghost danger> 幽灵危险 </LTButton>
					</div>
				</Card>
			</Col>
			<Col :xl="14" :lg="24">
				<Card title="BasicButton Types">
					<div>
						<h3>primary</h3>
						<LTButton type="primary" preIcon="mdi:page-next-outline">
							主按钮
						</LTButton>
						<LTButton type="primary" disabled> 禁用 </LTButton>
						<LTButton type="primary" danger preIcon="mdi:page-next-outline">
							危险
						</LTButton>
						<LTButton type="primary" loading> loading </LTButton>
						<LTButton type="link"> link </LTButton>
						<LTButton type="link" loading> loading link </LTButton>
						<LTButton type="link" disabled> disabled link </LTButton>
					</div>

					<div>
						<h3>default</h3>
						<LTButton type="default"> 默认 </LTButton>
						<LTButton type="default" disabled> 禁用 </LTButton>
						<LTButton type="default" danger> 危险 </LTButton>
						<LTButton type="default" loading> loading </LTButton>
						<LTButton type="link"> link </LTButton>
						<LTButton type="link" loading> loading link </LTButton>
						<LTButton type="link" disabled> disabled link </LTButton>
					</div>

					<div>
						<h3>dashed</h3>
						<LTButton type="dashed"> dashed </LTButton>
						<LTButton type="dashed" disabled> 禁用 </LTButton>
						<LTButton type="dashed" danger> 危险 </LTButton>
						<LTButton type="dashed" loading> loading </LTButton>
					</div>

					<div>
						<h3>ghost 常规幽灵按钮通常用于有色背景下</h3>
						<div class="bg-gray-400 py-2">
							<LTButton ghost type="primary"> 幽灵主要 </LTButton>
							<LTButton ghost type="default"> 幽灵默认 </LTButton>
							<LTButton ghost type="dashed"> 幽灵dashed </LTButton>
							<LTButton ghost type="primary" disabled> 禁用 </LTButton>
							<LTButton ghost type="primary" loading> loading </LTButton>
						</div>
					</div>
				</Card>
			</Col>
		</Row>
	</LTPageLayout>
</template>

<script setup lang="ts">
import { LTPageLayout, LTButton } from 'lt-frame';
import { Card, Row, Col } from 'ant-design-vue';
</script>
