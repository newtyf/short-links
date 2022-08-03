<template>
<h1 class="text-center">Register</h1>
  <a-row>
    <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
      <a-form
        :model="formState"
        name="basicRegister"
        autocomplete="off"
        layout="vertical"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="E-mail"
          name="email"
          :rules="[
            {
              required: true,
              whitespace: true,
              type: 'email',
              message: 'Por favor, ingrese su email',
            },
          ]"
        >
          <a-input
            type="email"
            placeholder="ingrese email"
            v-model:value="formState.email"
          />
        </a-form-item>
        <a-form-item
          has-feedback
          label="Contraseña"
          name="password"
          :rules="[
            {
              required: true,
              min: 6,
              whitespace: true,
              message: 'Ingrese una contraseña con minimo 6 caracteres',
            },
          ]"
        >
          <a-input-password
            placeholder="Ingrese contraseña"
            v-model:value="formState.password"
          />
        </a-form-item>
        <a-form-item
          has-feedback
          label="Repetir contraseña"
          name="repassword"
          :rules="[
            {
              required: true,
              validator: validatePass,
            },
          ]"
        >
          <a-input-password
            placeholder="Ingrese contraseña"
            v-model:value="formState.repassword"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="submit"
            html-type="submit"
            :disabled="userStore.loadingUser"
          >
            Resgitrar
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup>
import { reactive } from "vue";
import { useUserStore } from "../stores/user";
import { message } from "ant-design-vue";
//import { useRouter } from 'vue-router';

const userStore = useUserStore();
//const router = useRouter();

const formState = reactive({
  email: "",
  password: "",
  repassword: "",
});

const validatePass = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Repita contraseña");
  } else if (value !== formState.password) {
    return Promise.reject("Las contraseñas no coninciden");
  } else {
    return Promise.resolve();
  }
};

const onFinish = async (values) => {
  console.log("Success:", values);
  const res = await userStore.registerUser(formState.email, formState.password);
  console.log(res);
  switch (res) {
    case undefined:
      message.success('Bienvenido cabro chico 🐲');
      break;
    case 'auth/email-already-in-use':
      message.error('El correo ingresado ya esta en uso  🐐', 1)
      break;
    case 'auth/wrong-password':
      message.error('El usuario y/o contraseña que ingreso no son correctos 💋🐐', 1)
      break;
    case 'auth/too-many-requests':
      message.warning('Ha realizado muchos intentos fallidos espere 2 minutos 🏴‍☠️ 🏴‍☠️', 1)
      break;
    default:
      message.error('Ocurrio un error en el servidor 🤑🤑, intentelo mas tarde', 1)
      break;
  }
  //router.push('/')
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>
