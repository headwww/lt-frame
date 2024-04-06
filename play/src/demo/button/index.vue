<template>
	<LtPageLayout :dense="false" title="button组件的各种使用">
		<Row :gutter="[20, 20]">
			<Col :xl="10" :lg="24">
				<Card title="BasicButton Color">
					<div>
						<h3>success</h3>
						<div>
							<LtButton color="success"> 成功 </LtButton>
							<LtButton color="success" disabled> 禁用 </LtButton>
							<LtButton color="success" loading> loading </LtButton>
							<LtButton color="success" type="link"> link </LtButton>
							<LtButton color="success" type="link" loading>
								loading link
							</LtButton>
							<LtButton color="success" type="link" disabled>
								disabled link
							</LtButton>
						</div>
					</div>

					<div>
						<h3>warning</h3>
						<LtButton color="warning"> 警告 </LtButton>
						<LtButton color="warning" disabled> 禁用 </LtButton>
						<LtButton color="warning" loading> loading </LtButton>
						<LtButton color="warning" type="link"> link </LtButton>
						<LtButton color="warning" type="link" loading>
							loading link
						</LtButton>
						<LtButton color="warning" type="link" disabled>
							disabled link
						</LtButton>
					</div>

					<div>
						<h3>error</h3>
						<LtButton color="error"> 错误 </LtButton>
						<LtButton color="error" disabled> 禁用 </LtButton>
						<LtButton color="error" loading> loading </LtButton>
						<LtButton color="error" type="link"> link </LtButton>
						<LtButton color="error" type="link" loading>
							loading link
						</LtButton>
						<LtButton color="error" type="link" disabled>
							disabled link
						</LtButton>
					</div>

					<div>
						<h3>ghost</h3>
						<LtButton ghost color="success"> 幽灵成功 </LtButton>
						<LtButton ghost color="warning"> 幽灵警告 </LtButton>
						<LtButton ghost color="error"> 幽灵错误 </LtButton>
						<LtButton ghost type="dashed" color="warning">
							幽灵警告dashed
						</LtButton>
						<LtButton ghost danger> 幽灵危险 </LtButton>
					</div>
				</Card>
			</Col>
			<Col :xl="14" :lg="24">
				<Card title="BasicButton Types">
					<div>
						<h3>primary</h3>
						<LtButton type="primary" preIcon="mdi:page-next-outline">
							主按钮
						</LtButton>
						<LtButton type="primary" disabled> 禁用 </LtButton>
						<LtButton type="primary" danger preIcon="mdi:page-next-outline">
							危险
						</LtButton>
						<LtButton type="primary" loading> loading </LtButton>
						<LtButton type="link"> link </LtButton>
						<LtButton type="link" loading> loading link </LtButton>
						<LtButton type="link" disabled> disabled link </LtButton>
					</div>

					<div>
						<h3>default</h3>
						<LtButton type="default"> 默认 </LtButton>
						<LtButton type="default" disabled> 禁用 </LtButton>
						<LtButton type="default" danger> 危险 </LtButton>
						<LtButton type="default" loading> loading </LtButton>
						<LtButton type="link"> link </LtButton>
						<LtButton type="link" loading> loading link </LtButton>
						<LtButton type="link" disabled> disabled link </LtButton>
					</div>

					<div>
						<h3>dashed</h3>
						<LtButton type="dashed"> dashed </LtButton>
						<LtButton type="dashed" disabled> 禁用 </LtButton>
						<LtButton type="dashed" danger> 危险 </LtButton>
						<LtButton type="dashed" loading> loading </LtButton>
					</div>

					<div>
						<h3></h3>
						<div class="bg-gray-400 py-2">
							<LtButton ghost type="primary"> 幽灵主要 </LtButton>
							<LtButton ghost type="default"> 幽灵默认 </LtButton>
							<LtButton ghost type="dashed"> 幽灵dashed </LtButton>
							<LtButton ghost type="primary" disabled> 禁用 </LtButton>
							<LtButton ghost type="primary" loading> loading </LtButton>
						</div>
					</div>
				</Card>
			</Col>
		</Row>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout, LtButton } from '@lt-frame/components';
import { Card, Row, Col } from 'ant-design-vue';
</script>
