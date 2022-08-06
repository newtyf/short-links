<template>
  <div>
    <h1>Home</h1>
    <p>{{ userStore.userData?.email }}</p>

    <AddForm />

    <p v-if="databaseStore.loadingDoc">Loading...</p>

    <a-space
      direction="vertical"
      v-if="!databaseStore.loadingDoc"
      style="width: 100%"
    >
      <a-card
        v-for="item of databaseStore.documents"
        :key="item.id"
        :title="item.short"
      >
        <template #extra>
          <a-space>
            <a-popconfirm
              title="Are you sure delete this task?"
              ok-text="yes"
              cancel-text="no"
              @confirm="confirm(item.id)"
              @cancel="cancel"
            >
              <a-button size="default" danger :disabled="databaseStore.loading"
                >Eliminar</a-button
              >
            </a-popconfirm>
            <a-button
              @click="router.push(`/editar/${item.id}`)"
              type="primary"
              :disabled="databaseStore.loading"
              >Editar</a-button
            >
            <a-tooltip>
              <template #title>
                <span>Copiar Link</span>
              </template>
              <a-button @click="copyURL(item.id)"><copy-outlined /></a-button>
            </a-tooltip>
          </a-space>
        </template>
        <p style="overflow: hidden">{{ item.name }}</p>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useDatabaseStore } from "../stores/database";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { CopyOutlined } from "@ant-design/icons-vue";

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

databaseStore.getUrls();

const confirm = async (id) => {
  const res = await databaseStore.deleteUrl(id);

  if (!res) {
    return message.success("se elimino con exito 🐐");
  }
  return message.error(res);

  // switch (res) {
  //   case undefined:
  //     message.success('Se elimino con exito 🐐')
  //     break;
  //   default:
  //     break;
  // }
};

const copyURL = (id) => {
  if (!navigator.clipboard) {
    return message.error('No se pudo copiar al portapapeles 😭')
  }

  const path = `${window.location.origin}/${id}`
  console.log(path);
  navigator.clipboard.writeText(path).then(() => {
    message.success('Se copio el link 🥵')
  })
}

const cancel = () => {
  message.success("No se elimino");
};
</script>
