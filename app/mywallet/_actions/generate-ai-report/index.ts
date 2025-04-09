"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { OpenAI } from "openai";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";

type Transaction = {
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
};

type TransactionType = "INCOME" | "EXPENSE";

const DUMMY_REPORT =
  '### Relatório de Finanças Pessoais\n\n#### Resumo Geral das Finanças\nAs transações listadas foram analisadas e as seguintes informações foram extraídas para oferecer insights sobre suas finanças:\n\n- **Total de despesas:** R$ 19.497,56\n- **Total de investimentos:** R$ 14.141,47\n- **Total de depósitos/correntes:** R$ 10.100,00 (considerando depósitos de salário e outros)\n- **Categoria de maior despesa:** Alimentação\n\n#### Análise por Categoria\n\n1. **Alimentação:** R$ 853,76\n2. **Transporte:** R$ 144,05\n3. **Entretenimento:** R$ 143,94\n4. **Outras despesas:** R$ 17.828,28 (inclui categorias como saúde, educação, habitação)\n\n#### Tendências e Insights\n- **Despesas Elevadas em Alimentação:** A categoria de alimentação representa uma parte significativa de suas despesas, com um total de R$ 853,76 nos últimos meses. É importante monitorar essa categoria para buscar economia.\n  \n- **Despesas Variáveis:** Outros tipos de despesas, como entretenimento e transporte, também se acumulam ao longo do mês. Identificar dias em que se gasta mais pode ajudar a diminuir esses custos.\n  \n- **Investimentos:** Você fez investimentos significativos na ordem de R$ 14.141,47. Isso é um bom sinal para a construção de patrimônio e aumento de sua segurança financeira no futuro.\n  \n- **Categorização das Despesas:** Há uma série de despesas listadas como "OUTRA", que podem ser reavaliadas. Classificar essas despesas pode ajudar a ter um controle melhor das finanças.\n\n#### Dicas para Melhorar Sua Vida Financeira\n\n1. **Crie um Orçamento Mensal:** Defina um limite de gastos para cada categoria. Isso ajuda a evitar gastos excessivos em áreas como alimentação e entretenimento.\n\n2. **Reduza Gastos com Alimentação:** Considere cozinhar em casa com mais frequência, planejar refeições e usar listas de compras para evitar compras impulsivas.\n\n3. **Revise Despesas Recorrentes:** Dê uma olhada nas suas despesas fixas (como saúde e educação) para verificar se estão adequadas às suas necessidades e se há espaço para redução.\n\n4. **Estabeleça Metas de Poupança:** Com base em seus depósitos e investimentos, estabeleça metas específicas para economizar uma porcentagem do seu rendimento mensal. Estimar quanto você pode economizar pode ajudar a garantir uma reserva de emergência.\n\n5. **Diminua os Gastos com Entretenimento:** Planeje lazer de forma que não exceda seu orçamento, busque opções gratuitas ou de baixo custo. Lembre-se de que entretenimento também pode ser feito em casa.\n\n6. **Reavalie Seus Investimentos:** Certifique-se de que seus investimentos estejam alinhados com seus objetivos financeiros a curto e longo prazo. Pesquise alternativas que podem oferecer melhor retorno.\n\n7. **Acompanhe Suas Finanças Regularmente:** Use aplicativos de gerenciamento financeiro para controlar suas despesas e receitas, ajudando você a manter-se informado sobre sua saúde financeira.\n\n#### Conclusão\nMelhorar sua vida financeira é um processo contínuo que envolve planejamento, monitoramento e ajustes regulares. Com as análises e as sugestões acima, você pode começar a tomar decisões financeiras mais estratégicas para alcançar seus objetivos. Lembre-se que cada real economizado é um passo a mais em direção à segurança financeira!';

export async function generateAIReport(userId: string) {
  try {
    // Definir período do relatório (último mês)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    // const transactions = await prisma.transactions.findMany({
    //   where: {
    //     userId,
    //     createdAt: {
    //       gte: startDate,
    //       lte: endDate,
    //     },
    //   },
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    // });

    const { userId: authUserId } = await auth();
    if (!authUserId) {
      throw new Error("Unauthorized");
    }
    const user = await clerkClient.users.getUser(authUserId);
    const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
    if (!hasPremiumPlan) {
      throw new Error("You need a premium plan to generate AI reports");
    }

    // Gerar relatório com base nas transações
    // const report = await generateReport(transactions);
    const report = { summary: DUMMY_REPORT, transactions: 0 };

    return report;
  } catch (error) {
    console.error("Error generating AI report:", error);
    throw error;
  }
}

async function generateReport(transactions: Transaction[]) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key não configurada");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Preparar os dados das transações para análise
  const transactionsSummary = transactions.reduce(
    (acc, transaction) => {
      const type = transaction.type;
      const amount = transaction.amount;
      const category = transaction.category;

      if (!acc[type]) {
        acc[type] = {
          total: 0,
          byCategory: {},
        };
      }

      acc[type].total += amount;

      if (!acc[type].byCategory[category]) {
        acc[type].byCategory[category] = 0;
      }
      acc[type].byCategory[category] += amount;

      return acc;
    },
    {} as Record<
      TransactionType,
      { total: number; byCategory: Record<string, number> }
    >,
  );

  // Criar prompt para o OpenAI
  const prompt = `
    Analise os seguintes dados financeiros e gere um relatório detalhado em português:
    
    Dados das transações:
    ${JSON.stringify(transactionsSummary, null, 2)}

    Por favor, inclua:
    1. Resumo geral das finanças
    2. Análise por categoria
    3. Tendências e insights
    4. Dicas personalizadas para melhorar a vida financeira
    5. Conclusão
    
    Use formatação markdown para estruturar o relatório.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Você é um consultor financeiro especializado em análise de dados e planejamento financeiro pessoal.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const report = completion.choices[0]?.message?.content || DUMMY_REPORT;
    return { summary: report, transactions: transactions.length };
  } catch (error) {
    console.error("Erro ao gerar relatório com OpenAI:", error);
    return { summary: DUMMY_REPORT, transactions: transactions.length };
  }
}
