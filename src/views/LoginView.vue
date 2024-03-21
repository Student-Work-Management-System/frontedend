<script lang="ts" setup>
import { onUpdated } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { Vue3Spline } from 'vue3-spline'
const visible = ref(false)
const loading = ref(true)

const updateLoading = () => {
  loading.value = false
  console.log('fuckfuckfuck')
}
onMounted(updateLoading)
</script>

<template>
  <main>
    <span class="form-box">
      <v-card
        :loading="loading"
        class="mx-auto pa-12 pb-8"
        elevation="8"
        rounded="xl"
        min-height="100%"
      >
        <div class="text-center text-deep-purple-darken-4 mb-3">
          <v-icon icon="mdi-cube" :size="64" />
        </div>
        <h1 class="text-h4 font-weight-bold text-center mb-8 text-deep-purple-darken-4">
          学生画像管理系统
        </h1>

        <div class="text-subtitle-1 text-medium-emphasis">账户</div>
        <v-text-field
          clearable
          density="compact"
          placeholder="输入账户"
          prepend-inner-icon="mdi-account-box"
          variant="outlined"
        >
          <v-tooltip activator="parent" location="top">账户名一般为 教师工号 或 学生学号</v-tooltip>
        </v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          密码
        </div>

        <v-text-field
          clearable
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="输入密码"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        >
          <v-tooltip activator="parent" location="top"
            >密码为 6-18 位任意数字、字母与常见字符的组合</v-tooltip
          >
        </v-text-field>

        <v-btn
          prepend-icon="mdi-login-variant"
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          >登 录</v-btn
        >
        <v-card class="mb-14" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            提示：若您忘记了账户密码，请联系管理员进行修改。<br />
          </v-card-text>
        </v-card>
        <v-tooltip location="start">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" href="#">
              <v-icon>mdi-account-question</v-icon>
            </v-btn>
          </template>
          <span>管理员联系方式：QQxxxxx</span>
        </v-tooltip>
      </v-card>
    </span>

    <span class="threed">
      <Vue3Spline
        :scene="{
          url: 'scene.splinecode'
        }"
      />
    </span>
  </main>
</template>

<style scoped>
.form-box {
  height: 100%;
  width: 40%;
  padding: 3rem 0 3rem 3rem;
}
.threed {
  height: 100%;
  width: 60%;
  padding: 3rem;
}
.threed #spline-canvas {
  border-radius: 2%;
  box-shadow:
    0px 1px 2.2px rgba(0, 0, 0, 0.02),
    0px 2.4px 5.3px rgba(0, 0, 0, 0.028),
    0px 4.5px 10px rgba(0, 0, 0, 0.035),
    0px 8px 17.9px rgba(0, 0, 0, 0.042),
    0px 15px 33.4px rgba(0, 0, 0, 0.05),
    0px 36px 80px rgba(0, 0, 0, 0.07);
}
main {
  height: 100vh;
  width: 100vw;
  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(-160deg, #8eb2e6, #8f6afb, #3e4add);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(-160deg, #8eb2e6, #8f6afb, #3e4add);
  display: flex;
}
</style>
