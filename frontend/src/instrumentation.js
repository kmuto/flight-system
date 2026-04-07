import {
  BatchSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: "my-app",
});

const provider = new WebTracerProvider({
  resource,
  spanProcessors: [
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: "http://localhost:4318/v1/traces", // URLはオプションで省略可能 - デフォルトは http://localhost:4318/v1/traces
        headers: {}, // 各リクエストで送信するカスタムヘッダーを含むオプションのオブジェクト
        concurrencyLimit: 10, // 保留中のリクエストに対するオプションの制限
      }),
      {
        // 最大キューサイズ。サイズに達した後、スパンは破棄されます。
        maxQueueSize: 100,
        // 各エクスポートの最大バッチサイズ。maxQueueSize以下である必要があります。
        maxExportBatchSize: 10,
        // 2つの連続したエクスポート間の間隔
        scheduledDelayMillis: 500,
        // エクスポートがキャンセルされるまでの実行可能時間
        exportTimeoutMillis: 30000,
      }
    ),
  ],
});

provider.register({
  contextManager: new ZoneContextManager(),
});

/*registerInstrumentations({
  instrumentations: [new FetchInstrumentation()],
});*/
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      // ここを追加！
      propagateTraceHeaderCorsUrls: [
        // 'http://localhost:8000', // LaravelのURL（絶対パスの場合）
        // /^\/api/                // /api/flights... のような相対パスの場合
        /.*/
      ],
    }),
  ],
});
