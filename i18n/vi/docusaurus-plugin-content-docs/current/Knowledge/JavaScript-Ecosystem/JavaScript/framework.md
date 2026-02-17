---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Hãy giải thích và so sánh ưu nhược điểm của SPA và SSR

### SPA (Ứng dụng Trang đơn)

#### Ưu điểm SPA

1. Trải nghiệm người dùng: Bản chất của SPA là một trang duy nhất, chỉ tải dữ liệu động và kết hợp routing frontend để người dùng cảm thấy như đang chuyển trang, nhưng thực tế chỉ đang chuyển component. Trải nghiệm sử dụng này tự nhiên mượt mà và nhanh hơn.
2. Tách biệt frontend-backend: Frontend chỉ cần đảm nhận render trang và tương tác, còn backend chỉ cần cung cấp API dữ liệu. Giảm bớt gánh nặng phát triển của cả hai phía và dễ bảo trì hơn.
3. Tối ưu mạng: Chỉ cần tải trang một lần, không như cấu trúc đa trang truyền thống phải tải lại mỗi lần chuyển trang, giảm số lượng request và gánh nặng server.

#### Nhược điểm SPA

1. SEO: Trang SPA được tải động, nên công cụ tìm kiếm không thể trực tiếp lấy nội dung trang (dù Google tuyên bố đang cải thiện điều này). Đối với crawler tìm kiếm, vẫn không bằng HTML truyền thống.
2. Thời gian tải lần đầu: SPA cần tải và thực thi JavaScript ở client trước khi render trang, nên thời gian tải lần đầu dài hơn, đặc biệt khi mạng không tốt.

### SSR (Render Phía Server)

#### Ưu điểm SSR

1. SEO: SSR render trang chứa dữ liệu sẵn ở server, nên công cụ tìm kiếm có thể lấy trực tiếp nội dung trang. Đây là ưu điểm lớn nhất của SSR.
2. Thời gian tải: SSR chuyển gánh nặng render sang server, có thể rút ngắn thời gian render lần đầu truy cập.

#### Nhược điểm SSR

1. Chi phí học và độ phức tạp: Lấy Next và Nuxt làm ví dụ, dù bản chất đều dựa trên React và Vue, nhưng đã phát triển hệ sinh thái riêng, tăng chi phí học. Nhìn phiên bản Next.js 14 gần đây, khách quan mà nói không phải mọi developer đều chấp nhận được thay đổi như vậy.
2. Gánh nặng server: Vì công việc render chuyển sang server, có thể tạo gánh nặng lớn hơn cho server, đặc biệt trong các tình huống lưu lượng cao.

### Kết luận

Nguyên tắc là, nếu là hệ thống back-office không có nhu cầu SEO, không cần thiết sử dụng framework SSR. Trừ khi là trang web sản phẩm phụ thuộc vào công cụ tìm kiếm, thì có thể đánh giá việc sử dụng framework SSR.

## 2. Hãy trình bày về các Web Framework đã sử dụng và so sánh ưu nhược điểm

**Cả hai đều đang hội tụ về "phát triển component dựa trên hàm":**

> Vue 3 thông qua Composition API, tách logic thành các composable tái sử dụng; React lấy Hooks làm cốt lõi. Về trải nghiệm developer, cả hai khá tương đồng, nhưng nhìn chung Vue có chi phí nhập môn thấp hơn, còn React mạnh hơn về hệ sinh thái và tính linh hoạt.

### Vue (chủ yếu Vue 3)

**Ưu điểm:**

- **Đường cong học tập thoải mái hơn**: SFC (Single File Component) gộp template / script / style lại, rất thân thiện với developer chuyển từ frontend truyền thống (backend template).
- **Quy ước chính thức rõ ràng, có lợi cho team**: Hướng dẫn phong cách và quy ước chính thức rõ ràng, thành viên mới dễ duy trì tính nhất quán khi tiếp nhận dự án.
- **Hệ sinh thái cốt lõi hoàn chỉnh**: Chính thức duy trì Vue Router, Pinia (hoặc Vuex), CLI / Vite Plugin, v.v., từ tạo dự án đến quản lý state, routing đều có "giải pháp chính thức", giảm chi phí lựa chọn.
- **Composition API nâng cao khả năng bảo trì**: Có thể tách logic theo chức năng thành composable (ví dụ: useAuth, useForm), chia sẻ logic và giảm code trùng lặp trong dự án lớn.

**Nhược điểm:**

- **Hệ sinh thái và cộng đồng nhỏ hơn React một chút**: Số lượng và đa dạng của package bên thứ ba không bằng React, một số công cụ tiên tiến ưu tiên React trước.
- **Thị trường việc làm tập trung ở các khu vực/ngành cụ thể**: So với React, các team quốc tế hoặc đa quốc gia chủ yếu dùng React, bất lợi về tính linh hoạt nghề nghiệp (nhưng trong vùng nói tiếng Hoa thì khoảng nửa nửa).

---

### React

**Ưu điểm:**

- **Hệ sinh thái khổng lồ, tốc độ cập nhật công nghệ nhanh**: Hầu hết tất cả công nghệ frontend mới, hệ thống thiết kế hoặc dịch vụ bên thứ ba đều ưu tiên cung cấp phiên bản React.
- **Linh hoạt cao, tự do kết hợp stack công nghệ theo dự án**: Kết hợp với Redux / Zustand / Recoil và các state management khác, cũng có Meta Framework như Next.js, Remix, với giải pháp chín muồi từ SPA đến SSR, SSG, CSR.
- **Tích hợp chín muồi với TypeScript và kỹ thuật frontend**: Nhiều thảo luận cộng đồng về typing và best practices cho dự án lớn, hữu ích cho các dự án bảo trì dài hạn.

**Nhược điểm:**

- **Tự do cao, team cần tự định quy tắc**: Không có coding style rõ ràng hay quy ước kiến trúc, các developer có thể dùng cách viết và state management hoàn toàn khác nhau, tăng chi phí bảo trì.
- **Đường cong học tập thực tế không thấp**: Ngoài React (JSX, tư duy Hooks), còn phải đối mặt với Router, state management, data fetching, SSR, v.v., người mới dễ bị lạc trong "chọn library nào".
- **Thay đổi API và tiến hóa best practices nhanh**: Từ Class Component sang Function Component + Hooks, rồi Server Components, khi dự án cũ và phong cách mới cùng tồn tại, cần chi phí di chuyển và bảo trì thêm.
