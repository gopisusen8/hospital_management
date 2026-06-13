package com.hcl.DoctorAppointment.util;

import org.springframework.stereotype.Component;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class QRCodeGenerator {

    public String generateQRCodeUrl(String data, int width, int height) {
        try {
            String encodedData = URLEncoder.encode(data, StandardCharsets.UTF_8.toString());
            return "https://api.qrserver.com/v1/create-qr-code/?size=" + width + "x" + height + "&data=" + encodedData;
        } catch (Exception e) {
            return "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=error";
        }
    }
}
