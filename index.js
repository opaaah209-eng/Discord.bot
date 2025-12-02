// Discord Bot completo com comandos:
// /cargo, /removercargo, /trocarnomebot, /botarfotobot
// Feito para rodar em Replit + Discloud

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// ==========================
// CONFIGURAÇÃO DO BOT
// ==========================
const TOKEN = process.env.TOKEN; // Coloque no ambiente do Replit ou Discloud
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ==========================
// SLASH COMMANDS
// ==========================
const commands = [
    new SlashCommandBuilder()
        .setName('cargo')
        .setDescription('Adiciona um cargo a um membro.')
        .addUserOption(opt => opt.setName('membro').setDescription('Selecione o membro').setRequired(true))
        .addRoleOption(opt => opt.setName('rank').setDescription('Cargo a adicionar').setRequired(true)),

    new SlashCommandBuilder()
        .setName('removercargo')
        .setDescription('Remove um cargo do membro.')
        .addUserOption(opt => opt.setName('membro').setDescription('Selecione o membro').setRequired(true))
        .addRoleOption(opt => opt.setName('rank').setDescription('Cargo a remover').setRequired(true)),

    new SlashCommandBuilder()
        .setName('trocarnomebot')
        .setDescription('Troca o nome do bot.')
        .addStringOption(opt => opt.setName('nome').setDescription('Novo nome do bot').setRequired(true)),

    new SlashCommandBuilder()
        .setName('botarfotobot')
        .setDescription('Muda a foto do bot.')
        .addAttachmentOption(opt => opt.setName('imagem').setDescription('Envie a imagem').setRequired(true)),
].map(cmd => cmd.toJSON());

// Registra comandos
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Comandos carregados.');
    } catch (err) {
        console.error(err);
    }
})();

// ==========================
// EVENTOS E FUNÇÕES
// ==========================
client.on('ready', () => {
    console.log(`Bot logado como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // /cargo
    if (interaction.commandName === 'cargo') {
        const membro = interaction.options.getUser('membro');
        const rank = interaction.options.getRole('rank');
        const guildMember = await interaction.guild.members.fetch(membro.id);

        await guildMember.roles.add(rank);
        await interaction.reply({ content: `Cargo **${rank.name}** adicionado para ${membro}.`, ephemeral: true });
    }

    // /removercargo
    if (interaction.commandName === 'removercargo') {
        const membro = interaction.options.getUser('membro');
        const rank = interaction.options.getRole('rank');
        const guildMember = await interaction.guild.members.fetch(membro.id);

        await guildMember.roles.remove(rank);
        await interaction.reply({ content: `Cargo **${rank.name}** removido de ${membro}.`, ephemeral: true });
    }

    // /trocarnomebot
    if (interaction.commandName === 'trocarnomebot') {
        const nome = interaction.options.getString('nome');

        await client.user.setUsername(nome);
        await interaction.reply({ content: `Nome do bot alterado para **${nome}**.`, ephemeral: true });
    }

    // /botarfotobot
    if (interaction.commandName === 'botarfotobot') {
        const img = interaction.options.getAttachment('imagem');

        await client.user.setAvatar(img.url);
        await interaction.reply({ content: `Foto do bot alterada com sucesso.`, ephemeral: true });
    }
});

client.login(TOKEN);
