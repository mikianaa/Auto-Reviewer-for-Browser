# 1. はじめに

このレポジトリは、AIを用いた文書フィードバック機能を持つブラウザ拡張機能 *AutoReviewer for Browser*のレポジトリである 。

大規模言語モデル（LLM）を活用する際のプロンプトエンジニアリングにおいては、「ロールプレイング（役割指定）」が有効な手法の一つとされている。これは、AIに特定の人物や立場になりきらせることで、より文脈に沿った応答を引き出す技術であり、ユーザーがAIの視点や態度を制御するために用いられている。

この手法をライティング支援に応用した研究として、Benharrakらは2024年に発表した論文 *"Writer-Defined AI Personas for On-Demand Feedback Generation"* [1]において、Impressonaという対話型フィードバックシステムを提案している。Impressonaは、書き手が事前に定義した架空人格（ペルソナ）に基づいてAIが文章をレビューするものであり、ユーザーは視点の異なる複数の読者からのフィードバックを得ることができる。研究では、このシステムが文章能力の改善を促す可能性が示唆されている。

しかし、現状のImpressonaは専用エディタでのみ動作するという制限がある。本プロジェクトでは、このシステムをブラウザ拡張機能として実装することで、Word、Notion、VSCode、各種ブログサイトなど、ブラウザベースでの動作がサポートされているエディタ全般でImpressonaのフィードバック機能を利用可能にすることを目指す。

# 2. 参考文献
[1] Benharrak, K., Zindulka, T., Lehmann, F., Heuer, H., & Buschek, D. (2024). Writer-Defined AI Personas for On-Demand Feedback Generation. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (pp. 1-18). DOI: 10.1145/3613904.3642406
