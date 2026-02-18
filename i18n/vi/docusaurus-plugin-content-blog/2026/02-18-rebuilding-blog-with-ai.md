---
slug: rebuilding-blog-with-ai
title: 'Xây dựng lại toàn bộ blog bằng Claude Code'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

Trước năm 2023-2024, tôi thấy blog kỹ thuật kiểu truyền thống vẫn còn khá giá trị. Dù sao thì mình cũng có thể tổng hợp ghi chú cá nhân, kinh nghiệm phỏng vấn, những bài đã gặp, thậm chí cả những cái bẫy và chi tiết vặt mà mình từng đạp phải.

Nhưng từ giữa năm 2025 trở đi, tốc độ lặp lại của các mô hình ngày càng nhanh, đồng thời cũng ngày càng mạnh. Thậm chí ngay cả Cursor — cái mà nửa đầu 2025 tôi thấy dùng cũng ổn — đến nửa cuối năm thì rõ ràng cảm nhận được là không chống nổi Claude Code nữa. Lúc đó tôi biết là phải theo thời đại, dọn dẹp lại toàn bộ cái blog này rồi (hy vọng là vẫn giữ được chút giá trị).

<!--truncate-->

## Dữ liệu

Đưa số liệu lên đầu trước, bởi vì khối lượng này mà thuần nhân lực thì tốn thời gian kinh khủng, và tôi dám chắc rằng, xác suất cao là sẽ bị chứng trì hoãn đánh bại hoàn toàn. Nhưng với sự hỗ trợ của công cụ AI, hoàn thành trong 10 ngày (mà còn đúng dịp Tết Nguyên Đán), chất lượng tạm được, coi như một phép màu nhỏ.

| Metric                      | Value                     |
| --------------------------- | ------------------------- |
| Duration                    | 10 days (Feb 8–18, 2026)  |
| Total commits               | 104                       |
| Files changed               | 1,078                     |
| Lines inserted              | 263,000+                  |
| Lines deleted               | 21,000+                   |
| Locales                     | 4 → 10                    |
| Docs translated to English  | 89                        |
| Translation files generated | 801 (89 docs × 9 locales) |
| Blog posts with full i18n   | 5                         |
| Tools used                  | Claude Code               |

## Thực tế đã làm những gì

### Phase 1: Nền tảng (8–9 tháng 2) — 8 commits

Thiết kế lại trang chủ và trang About từ đầu. Thiết lập `CLAUDE.md` làm hiến pháp cho dự án — định dạng commit, quy tắc i18n, quy ước cấu trúc file. Mở rộng ngôn ngữ từ 4 lên 6. Toàn bộ quá trình đều tương tác trực tiếp với Claude Code.

Giai đoạn này chủ yếu là đưa ra quyết định kiến trúc: Trang chủ nên trông ra sao? Trang About quy hoạch thế nào? Toàn bộ dự án tuân theo quy ước gì? Những câu hỏi này đều thông qua trao đổi với Claude, đặc biệt là lập kế hoạch thực hiện, tôi chỉ chịu trách nhiệm review và điều chỉnh.

### Phase 2: Mở rộng quy mô (11–12 tháng 2) — 14 commits

Thêm 4 ngôn ngữ nữa (pt-BR, de, fr, vi), gom đủ 10. Tạo file dịch theme. Thiết kế lại navbar và sidebar để tổ chức nội dung tốt hơn. Chuyển `defaultLocale` sang `en` và cấu hình Vercel i18n routing. Nâng cấp dependencies. Việc mở rộng ngôn ngữ gần như toàn bộ là công việc cơ học — đúng kiểu AI giỏi nhất, tuy rất tốn Token, nhưng nếu dùng nhân lực thì gần như không thể hoàn thành trong thời gian cực ngắn.

### Phase 3: Nội dung (13–14 tháng 2) — 14 commits

Dọn dẹp bài blog cũ. Viết bài tổng kết cuối năm. Dịch toàn bộ bài blog sang 10 ngôn ngữ. Xây trang Projects showcase. Hoàn thành i18n trang chủ. Sửa bug component UI (căn chỉnh nút ShowcaseCard, dropdown bị cắt).

Giai đoạn này gặp phải tình huống là, thật ra AI không giỏi phát hiện lỗi vỡ giao diện (vấn đề UI) ngay lần đầu, mà phải qua nhiều lần trao đổi, do con người (tức là tôi) liên tục chỉ ra hướng sửa, mới có thể đưa giao diện về đúng.

### Phase 4: Sidebar + Blog (15 tháng 2) — 7 commits

Tổ chức lại toàn bộ cấu trúc sidebar của docs. Dịch nhãn category sidebar cho cả 10 ngôn ngữ. Xóa sạch 206 key dịch thừa còn sót lại từ lần tái cấu trúc trước. Viết và dịch bài blog đàm phán sa thải sang tất cả ngôn ngữ.

### Phase 5: Dịch docs i18n (16–17 tháng 2) — 14 commits

Batch lớn nhất: dịch 89 tài liệu sang 9 ngôn ngữ không phải tiếng Anh, tạo ra 801 file dịch. Bao gồm Knowledge (JavaScript, TypeScript, CSS, Vue, React, Browser, Security, Engineering), Experience và Coding.

Giai đoạn này và giai đoạn tiếp theo đều cực kỳ tốn Token, ném toàn bộ công việc dịch thuật mang tính cơ học cao cho AI, để nó phát huy hết sức (dù sao thì tôi cũng chẳng đọc hiểu được nhiều ngôn ngữ trong đó).

### Phase 6: Sửa chất lượng (17–18 tháng 2) — 24 commits

Giai đoạn này tồn tại vì đầu ra của Phase 5 không đủ sạch. Đúng 24 commits chỉ để sửa bản dịch do AI tạo:

- **Tiếng Đức**: Umlaut bị render thành ASCII (`ue` thay vì `ü`, `ae` thay vì `ä`)
- **Tiếng Pháp**: Dấu bị bỏ mất (`e` thay vì `é`, `a` thay vì `à`)
- **Tiếng Việt**: Dấu thanh biến mất hoàn toàn (tiếng Việt mà không có dấu thì gần như không đọc nổi)
- **Tiếng Tây Ban Nha/Bồ Đào Nha**: Dấu bị rơi xuyên suốt bài
- **Tiếng Trung Giản thể**: Lẫn ký tự Phồn thể vào (AI đôi khi phân biệt không nổi hai hệ chữ viết)
- **Tàn dư CJK**: Comment tiếng Trung trong code block không được dịch ở es, pt-BR, ja, ko, vi

Cứ mỗi lần sửa xong một vấn đề lại mọc ra thêm vấn đề mới. Sửa dấu tiếng Bồ Đào Nha thì overcorrect, làm hỏng trường `id` và `slug` trong frontmatter. Sửa dấu thanh tiếng Việt thì bỏ sót một file. Sửa dấu tiếng Tây Ban Nha thì gặp nhận diện sai, phải bổ sung thêm một commit sửa nữa.

Thật ra ở giai đoạn này, trừ phi bạn biết một ngôn ngữ nào đó, không thì nhân lực thật sự không thể can thiệp, chỉ có thể hoàn toàn dựa vào các mô hình khác nhau kiểm tra chéo.

**Những thứ AI không giỏi nhận diện**:

```markdown
// Example:

- Xử lý đúng dấu umlaut và dấu thanh ngay lần đầu (accents, umlauts, tonal marks)
- Phân biệt ổn định giữa tiếng Trung Phồn thể và Giản thể
- Quyết định comment trong code nên giữ nguyên hay dịch
- Giữ nguyên trường frontmatter không bị thay đổi trong quá trình chuyển đổi nội dung
```

## Những cái bẫy

**Thảm họa dấu và thanh điệu.** AI thay thế ký tự không phải ASCII bằng giá trị gần đúng ASCII ở năm ngôn ngữ. Kết quả là 24 commits sửa lỗi — gần một phần tư tổng số. Tiếng Việt là trường hợp thảm nhất: thiếu dấu thanh thì toàn bộ ngôn ngữ gần như không thể nhận ra.

**Lẫn lộn Phồn thể và Giản thể.** Bản dịch `zh-cn` chứa ký tự Phồn thể trong comment code và trích dẫn inline. AI không thể phân biệt nhất quán giữa hai hệ chữ viết này.

**Hỏng frontmatter.** Khi dịch tài liệu, AI đôi khi sửa luôn trường `id` và `slug` trong frontmatter, làm hỏng routing của Docusaurus. Có một commit riêng chỉ để sửa `id` và `slug` tiếng Bồ Đào Nha bị hỏng trong quá trình sửa dấu.

**Vòng lặp overcorrect.** Sửa một vấn đề thường kéo theo vấn đề khác. Bản sửa dấu tiếng Bồ Đào Nha overcorrect một số thuật ngữ kỹ thuật. Bản sửa dấu thanh tiếng Việt bỏ sót một file. Mỗi commit "sửa lỗi" đều có xác suất nhất định tạo ra lỗi mới.

## Con người vẫn can thiệp được ở đâu

**Quyết định kiến trúc.** Hỗ trợ 10 ngôn ngữ nào. Sidebar tổ chức ra sao. Cái gì nằm trong navbar dropdown, cái gì ở top-level. Những quyết định này ảnh hưởng đến toàn bộ công việc phía sau.

**Đánh giá chất lượng.** UI có bị vỡ không, có đúng với thiết kế không. Bản dịch có lỗi rõ ràng không, ví dụ chuyển defaultLocale có đúng tương ứng không.

**File `CLAUDE.md`.** Bản chất là hiến pháp của repo, dùng để dạy AI quy ước dự án của bạn: định dạng commit, cấu trúc file, quy tắc i18n, những điều tuyệt đối không được làm. File này viết càng hoàn chỉnh thì AI càng ít sai, nhân lực càng ít phải can thiệp, nên cần liên tục lặp lại và cập nhật.

## Tâm đắc

**Bắt đầu với một `CLAUDE.md` hoàn chỉnh.** Mỗi quy ước viết vào đó, sau này đều tiết kiệm được hàng chục vòng sửa lỗi. Từ vài dòng ngắn phát triển thành một tài liệu đầy đủ, bao gồm định dạng commit, quy tắc i18n, cấu trúc dự án, và cả những điều cấm rõ ràng.

**Gom batch công việc tương tự, review theo batch.** Đừng dịch từng file một. Ném cho AI 15 file tương tự cùng lúc, rồi review cả batch, tránh được việc nhân lực phải duyệt quá nhiều chi tiết lẻ.

**Tận dụng chạy song song công cụ.** Đồng thời cho Claude Code xử lý công việc tương tác, rồi chuyển giao cho Gemini, Codex xử lý công việc batch, đó là cải thiện hiệu suất lớn nhất. Đừng chạy tuần tự những thứ có thể chạy song song.

**Ghi lại mọi thứ.** Mỗi commit message, mỗi ranh giới giai đoạn, mỗi lần sửa — tất cả đều nằm trong lịch sử. Nếu bạn đang làm dự án lớn có AI hỗ trợ, commit history chính là tài liệu.
