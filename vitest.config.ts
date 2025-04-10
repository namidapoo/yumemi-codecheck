import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			include: ["{app,components}/**/*"],
			exclude: [
				...coverageConfigDefaults.exclude,
				"**/next.config.ts",
				"**/*.{stories,mock}.*",
				"**/layout.tsx",
			],
			all: true,
		},
	},
});
