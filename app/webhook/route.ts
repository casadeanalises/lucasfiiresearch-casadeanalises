import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log('Webhook recebido em /webhook');
    
    const url = new URL(request.url);
    const newUrl = new URL("/api/webhooks/stripe", url.origin);
    
    // Clonar os headers
    const headers = new Headers(request.headers);
    
    // Ler o corpo da requisição
    const body = await request.text();
    console.log('Corpo da requisição:', body.substring(0, 100) + '...');
    
    console.log('Headers originais:', Object.fromEntries(headers.entries()));
    
    // Criar uma nova requisição com o mesmo corpo e headers
    const newRequest = new Request(newUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    console.log('Encaminhando requisição para:', newUrl.toString());
    
    // Fazer a requisição para o novo endpoint
    const response = await fetch(newRequest);
    console.log('Resposta recebida com status:', response.status);
    
    const responseData = await response.text();
    console.log('Corpo da resposta:', responseData.substring(0, 100) + '...');
    
    // Retornar a resposta do endpoint final
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erro detalhado no webhook:', error);
    // Retornar uma resposta mais detalhada para debug
    return new NextResponse(
      JSON.stringify({
        error: 'Erro interno no webhook',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
