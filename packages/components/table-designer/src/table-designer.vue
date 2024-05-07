<template>
	<div class="flex pos-relative min-h-0 flex-1 h-full">
		<div class="w-350px bg-white h-full flex-shrink-0 pos-relative z820">
			<slot name="n"></slot>
		</div>
		<div class="flex flex-1 flex-col">
			<div class="flex-1" style="background-color: #edeff3">
				<div
					class="w-full h-full pos-relative font-size-12px"
					style="box-sizing: border-box"
				>
					<div class="pos-absolute pos-top-0 pos-right-0 w-full h-full">
						<div class="w-full h-full">
							<div class="pos-relative overflow-auto h-full w-full">
								<div
									class="pos-absolute m-auto pos-top-16px pos-right-16px pos-bottom-16px pos-left-16px w-auto"
									style="box-shadow: 0 1px 4px 0 rgb(31 50 88 / 12.5%)"
								>
									<div
										class="pos-absolute m-auto pos-top-0 pos-right-0 pos-bottom-0 pos-left-0 w-full overflow-hidden"
									>
										<slot name="w"></slot>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="w-350px bg-white h-full flex-shrink-0 pos-relative z820">
			right-pane
		</div>
	</div>
</template>

<script lang="ts" setup></script>
