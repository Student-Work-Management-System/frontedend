<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Vue3Spline } from 'vue3-spline'
import { apiLogin, userDataCheck } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useCookies } from 'vue3-cookies'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { watch } from 'vue'

interface UserLoginData {
  username: string
  password: string
}

const store = useUserStore()
const router = useRouter()
const route = useRoute()
const { cookies } = useCookies()

const userForm = reactive<UserLoginData>({ username: '', password: '' })
const visible = ref(false)
const loading3D = ref(true)
const loadingForm = ref(true)
const remember = ref(false)

const loginHandler = async () => {
  loadingForm.value = true
  const { data: result } = await apiLogin(userForm.username, userForm.password)
  if (result.code != 200) {
    // todo login error

    return
  }
  store.updateUser(result.data)
  if (remember.value) {
    cookies.set('user-cache', JSON.stringify(result.data), '1d')
  }
  loadingForm.value = false
  router.push({ name: 'home' })
}

const updateLoading3D = () => {
  loading3D.value = false
}

const checkLoginCacheHandler = () => {
  const cacheJson = cookies.get('user-cache') as Object
  if (cacheJson !== null) {
    try {
      const userData = userDataCheck(cacheJson)
      store.updateUser(userData)
      const to = route.redirectedFrom
      if (to === undefined) router.push({ name: 'home' })
      else router.push(to)
    } catch (error) {
      console.log(error)
      // todo error message
      cookies.remove('user-cache')
    }
  }
  if (!loading3D.value) {
    loadingForm.value = false
    return
  }
  // 异步等待 3d 加载
  watch(
    loading3D,
    (val) => {
      if (!val) loadingForm.value = false
    },
    { once: true }
  )
}
onMounted(checkLoginCacheHandler)
</script>

<template>
  <main>
    <span class="form-box">
      <v-card
        :loading="loadingForm"
        :disabled="loadingForm"
        class="mx-auto py-12 px-16 pb-8"
        elevation="8"
        rounded="xl"
        min-height="100%"
      >
        <div class="text-center text-deep-purple-darken-4 mb-4">
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
          v-model="userForm.username"
        >
          <v-tooltip activator="parent" location="top">账户名一般为 教师工号 或 学生学号</v-tooltip>
        </v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          密码
        </div>

        <v-text-field
          clearable
          class="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="输入密码"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="userForm.password"
        >
          <v-tooltip activator="parent" location="top"
            >密码为 6-18 位任意数字、字母与常见字符的组合</v-tooltip
          >
        </v-text-field>

        <v-checkbox
          v-model="remember"
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
          color="indigo"
          label="记住账号"
          hide-details
        ></v-checkbox>

        <v-btn
          prepend-icon="mdi-login-variant"
          class="mb-4"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="loginHandler"
          >登 录</v-btn
        >

        <v-card class="mb-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            提示：忘记密码请联系管理员更改。
          </v-card-text>
        </v-card>

        <section class="foot">
          <v-tooltip class="btn" location="start">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" href="#">
                <v-icon>mdi-account-question</v-icon>
              </v-btn>
            </template>
            <span>管理员联系方式：QQxxxxx</span>
          </v-tooltip>
        </section>
      </v-card>
    </span>

    <span class="threed">
      <Vue3Spline
        :onLoaded="updateLoading3D"
        :scene="{
          url: 'scene.splinecode'
        }"
      />
    </span>
  </main>
</template>

<style>
.password .v-input__details {
  min-height: 0%;
}
</style>

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
.foot {
  position: absolute;
  bottom: 2.5rem;
  right: 4rem;
  display: flex;
  justify-content: end;
}
</style>
