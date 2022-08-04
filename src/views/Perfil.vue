<template>
  <a-row>
    <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }" class="text-center" style="margin-bottom: 30px;">
      <a-avatar :size="90" :src="userStore.userData.photoURL"></a-avatar>
    </a-col>
  </a-row>
  <a-row>
    <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">
      <a-form
        :model="userStore.userData"
        name="basicPerfil"
        autocomplete="off"
        layout="vertical"
        @finish="onFinish"
      >
        <a-form-item
          label="Tu correo (no modificar)"
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
          <a-input v-model:value="userStore.userData.email" disabled />
        </a-form-item>
        <a-form-item
          label="Ingrese su nombre"
          name="displayName"
          :rules="[
            {
              required: false,
              whitespace: true,
              message: 'Ingrese un nick valido',
            },
          ]"
        >
          <a-input
            placeholder="ingrese nombre"
            v-model:value="userStore.userData.displayName"
          />
        </a-form-item>

        <a-form-item>
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            list-type="picture"
            @change="handleChange"
          >
            <a-button>
              <upload-outlined></upload-outlined>
              Subir foto de perfil
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="userStore.loadingUser"
            >Guardar</a-button
          >
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script setup>
import { message } from "ant-design-vue";
import { ref } from "vue";
import { useUserStore } from "../stores/user.js";
import { UploadOutlined } from "@ant-design/icons-vue";

const userStore = useUserStore();

const fileList = ref([]);

const handleChange = (info) => {
  if (info.file.status !== "uploading") {

    const isJpgOrPng =
      info.file.type === "image/jpeg" || info.file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("solo imagenes png o jpg");
      handleRemove(info.file);
      return;
    }

    const isLt2M = info.file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Maximo 2MB!");
      handleRemove(info.file);
      return;
    }
  }

  //valida que sea solo una imagen
  // si se sube otra se reemplazara
  let resFileList = [...info.fileList];
  resFileList = resFileList.slice(-1);

  resFileList = resFileList.map((file) => {
    if (file.response) {
      file.url = file.response.url;
    }

    return file;
  });
  fileList.value = resFileList;
};

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const beforeUpload = (file) => {
  return false;
};

const onFinish = async (values) => {
  const res = await userStore.updateUser(userStore.userData.displayName);

  if (fileList.value[0]) {
    const res = await userStore.updateImageProfile(fileList.value[0])
    if (res) {
      return message.error('Problemas al subir tu imagen, intentalo mas tarde 💋')
    }
    message.success('Se actualizo tu imagen')
    handleRemove(fileList.value[0])
  }

  if (!res) {
    message.success("Se actualizo tu informacion 🦍");
  }
};

</script>
