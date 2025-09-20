import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.product.deleteMany();

  // Criar produtos de exemplo
  const products = await prisma.product.createMany({
    data: [
      {
        title: 'iPhone 15 Pro',
        description: 'O mais avançado iPhone com chip A17 Pro, câmera profissional e tela Super Retina XDR de 6,1 polegadas. Disponível em titânio natural.',
        price: 7999.99
      },
      {
        title: 'MacBook Air M2',
        description: 'Notebook ultrafino com chip M2, tela Liquid Retina de 13,6 polegadas, bateria que dura o dia todo e design em alumínio reciclado.',
        price: 12999.00
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Smartphone premium com S Pen integrada, câmera de 200MP, tela Dynamic AMOLED 2X de 6,8 polegadas e 5G ultrarrápido.',
        price: 8499.99
      },
      {
        title: 'Sony PlayStation 5',
        description: 'Console de videogame de última geração com SSD ultrarrápido, Ray Tracing em tempo real e áudio 3D imersivo.',
        price: 4199.90
      },
      {
        title: 'Nintendo Switch OLED',
        description: 'Console híbrido com tela OLED vibrante de 7 polegadas, áudio aprimorado e base com porta LAN integrada.',
        price: 2499.99
      },
      {
        title: 'AirPods Pro (2ª geração)',
        description: 'Fones de ouvido com cancelamento ativo de ruído, áudio espacial personalizado e case de carregamento MagSafe.',
        price: 2299.00
      },
      {
        title: 'Dell XPS 13',
        description: 'Ultrabook premium com processador Intel Core i7, tela InfinityEdge 13,4 polegadas e construção em fibra de carbono.',
        price: 9899.99
      },
      {
        title: 'iPad Pro 12.9"',
        description: 'Tablet profissional com chip M2, tela Liquid Retina XDR, suporte ao Apple Pencil e Magic Keyboard.',
        price: 13499.00
      }
    ]
  });

  console.log(`✅ Seed concluído! ${products.count} produtos criados.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });