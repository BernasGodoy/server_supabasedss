require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

//variaveis de ambiente do arquivo .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

//Alerta Visual
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('seu-projeto')){
    console.log('\n Atenção: não configurado .env');
    console.log('Abra o arquivo backend/ .env \n');
}
const supabase = createClient(supabaseUrl || '', supabaseKey || '');
module.exports = supabase;