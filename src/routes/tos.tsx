import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute('/tos')({
  component: TosPage,
})

function TosPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <Card className="w-full mx-auto p-6 md:p-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base md:text-lg font-bold text-center">
            Syarat dan Ketentuan Layanan Alkadi
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-zinc dark:prose-invert w-full text-sm md:text-base leading-relaxed space-y-6">
          <p>
            Selamat datang di Alkadi, platform penyewaan lapangan badminton yang beroperasi di Kebumen. 
            Dengan mengakses dan menggunakan layanan kami, Anda menyatakan telah membaca, memahami, 
            dan menyetujui seluruh isi dari Syarat dan Ketentuan ini.
          </p>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">1. Ketentuan Umum</h2>
          <ul className="space-y-2">
            <li>1. Ketentuan Umum
              <ul className="ml-6 space-y-1 list-[lower-alpha]">
                <li>Layanan Alkadi hanya dapat digunakan oleh pengguna yang berusia minimal 17 tahun.</li>
                <li>Pengguna wajib memiliki akun yang terdaftar secara resmi di platform Alkadi untuk melakukan pemesanan secara online.</li>
                <li>Pengguna bertanggung jawab atas keakuratan data yang diberikan saat proses pendaftaran.</li>
                <li>Alkadi berhak menolak atau membatasi akses pengguna yang melanggar aturan atau memberikan data palsu.</li>
              </ul>
            </li>
          </ul>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">2. Pemesanan dan Pembayaran</h2>
          <ul className="space-y-2">
            <li>a. Pengguna dapat melakukan pemesanan lapangan secara online melalui platform Alkadi atau langsung (offline) di lokasi lapangan.</li>
            <li>b. Untuk pemesanan online, hanya pengguna yang memiliki akun yang dapat melakukan pemesanan. Jadwal akan dikonfirmasi setelah pembayaran diterima.</li>
            <li>c. Untuk pemesanan offline, pengguna dapat langsung datang ke lokasi selama jam operasional, dan ketersediaan akan dikonfirmasi oleh petugas.</li>
            <li>d. Metode pembayaran yang diterima meliputi:
              <ul className="space-y-2">
                <li>- Transfer Bank</li>
                <li>- E-Wallet</li>
                <li>- QRIS</li>
                <li>- Cash on Delivery (COD)</li>
                <li>- Pembayaran tunai langsung di lokasi</li>
              </ul>
            </li>
            <li>e. Semua pemesanan dianggap final dan mengikat setelah dikonfirmasi oleh sistem atau petugas.</li>
          </ul>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">3. Kebijakan Pembatalan dan No-Show</h2>
          <ul className="space-y-2">
            <li>a. Tidak tersedia refund (pengembalian dana) dalam bentuk apa pun, baik untuk pembatalan online maupun offline.</li>
            <li>b. Tidak tersedia penjadwalan ulang setelah jadwal dikonfirmasi.</li>
            <li>c. Jika pengguna tidak hadir (no-show) sesuai jadwal, maka hak penggunaan hangus dan pembayaran dianggap sah serta tidak dapat dikembalikan.</li>
          </ul>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">4. Penggunaan Lapangan</h2>
          <ul className="space-y-2">
            <li>a. Pengguna harus hadir tepat waktu sesuai jadwal yang telah dipesan.</li>
            <li>b. Dilarang melakukan tindakan yang merusak fasilitas atau mengganggu kenyamanan pengguna lain.</li>
            <li>c. Alkadi berhak menghentikan sesi penggunaan jika terjadi pelanggaran terhadap aturan atau perilaku tidak pantas.</li>
          </ul>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">5. Tanggung Jawab</h2>
          <ul className="space-y-2">
            <li>a. Alkadi tidak bertanggung jawab atas cedera, kehilangan barang, atau kerusakan pribadi selama penggunaan fasilitas.</li>
            <li>b. Segala bentuk kerusakan akibat kelalaian pengguna menjadi tanggung jawab penuh pengguna tersebut.</li>
          </ul>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">6. Hak Kekayaan Intelektual</h2>
          <ul className="space-y-2">
            <li>a. Alkadi.co.id dan seluruh kontennya adalah milik Alkadi atau pihak ketiga yang memberikan lisensi.</li>
            <li>b. Konten dilindungi oleh hukum hak cipta, merek dagang, serta peraturan hukum di Indonesia dan internasional.</li>
            <li>c. Pengguna diberikan lisensi terbatas untuk mengakses dan menggunakan situs ini untuk keperluan pribadi dan non-komersial.</li>
            <li>d. Pengguna tidak diperbolehkan mengubah, menghapus, atau menyembunyikan informasi hak cipta, merek dagang, atau kepemilikan lainnya.</li>
            <li>Seluruh hak atas konten tetap menjadi milik Alkadi, dan hak penggunaan konten dapat dicabut sewaktu-waktu tanpa pemberitahuan.</li>
          </ul>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">7. Perubahan Syarat dan Ketentuan</h2>
          <ul className="space-y-2">
            <li>a. Alkadi berhak untuk mengubah, menambah, atau menghapus isi dari Syarat dan Ketentuan ini kapan saja.</li>
            <li>b. Perubahan akan berlaku setelah dipublikasikan di situs resmi Alkadi.</li>
            <li>c. Penggunaan layanan setelah perubahan dianggap sebagai bentuk persetujuan terhadap perubahan tersebut.</li>
          </ul>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">8. Perlindungan Hukum dan Perikatan</h2>
          <ul className="space-y-2">
            <li>Seluruh aktivitas di platform Alkadi.co.id dilindungi oleh:
              <ul className="space-y-2">
                <li>Undang-Undang Republik Indonesia No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik</li>
                <li>Undang-Undang Republik Indonesia No. 28 Tahun 2014 tentang Hak Cipta</li>
                <li>Dan peraturan perundang-undangan lainnya yang berlaku</li>
              </ul>
            </li>
            <li>Semua bentuk hubungan hukum antara pengguna dan Alkadi dianggap sah dan mengikat sesuai dengan ketentuan Kitab Undang-Undang Hukum Perdata (KUHPerdata).</li>
          </ul>

          <h2 className="mt-8 mb-2 text-base md:text-lg font-bold">10. Kontak Resmi</h2>
          <p className="space-y-2">
            Jika Anda memiliki pertanyaan, keluhan, atau memerlukan bantuan, silakan hubungi kami melalui:
          </p>
          <p className="flex items-center gap-2 space-y-2">
            <span>📧</span>
            <a href="mailto:alkadigroup@gmail.com" className="text-primary hover:underline">
              alkadigroup@gmail.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 