package com.Craza.WebstoreProject.orders;

import com.Craza.WebstoreProject.cart.CartService;
import com.Craza.WebstoreProject.exception.OutOfItemException;
import com.Craza.WebstoreProject.product.Product;
import com.Craza.WebstoreProject.product.ProductRepository;
import com.Craza.WebstoreProject.product.ProductService;
import com.Craza.WebstoreProject.user.User;
import com.Craza.WebstoreProject.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.text.DecimalFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final UserRepository userRepository;
    private final ProductService productService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final JavaMailSender mailSender;
    @Value("${emailUser}")
    private String EmailUser;
    public Order handleOrderFromCart(Long userId) throws MessagingException, UnsupportedEncodingException {
        Optional<User> tempUser = userRepository.findById(userId);
        Map<Long,Integer> tempCart = tempUser.get().getBasket();
        Order order = new Order();
        // If the cart is empty I'll do something in the controller part that returns a string saying the cart is empty and that
        // it cant purchase anything
        double totalPrice = 0.0;

        for(Long id : tempCart.keySet())
        {
            Product tempProduct = productService.getProduct(id);
            if(tempProduct.getTotalStock() <= 0)
            {
                cartService.removeFromCartWithId(id,userId);
            }
        }
        Map<Long,Integer> updatedCart = tempUser.get().getBasket();

        for(Long id : updatedCart.keySet())
        {
            Product tempProduct = productService.getProduct(id);
            if(tempProduct == null)
            {
                continue;
            }
            order.setCreatorId(userId);
            order.getProductNames().add(tempProduct.getName());
            order.getProductImages().add(tempProduct.getImageUrl());
            order.getProductPrices().add(tempProduct.getPrice());
            if(tempCart.get(id) > tempProduct.getTotalStock())
            {
                order.getQuantity().add(tempProduct.getTotalStock());
            }
            else
            {
                order.getQuantity().add(tempCart.get(id));
            }
            if(tempProduct.getTotalStock() == 0)
            {
                productService.deleteProduct(id);
            }

            tempProduct.setTotalStock(tempProduct.getTotalStock() - tempCart.get(id));
            productRepository.save(tempProduct);
            totalPrice += (tempProduct.getPrice() * tempCart.get(id));
            order.setTotalPrice(totalPrice);
        }
        cartService.emptyCart(userId);
        // Make sure to remove from cart at the end.
        orderRepository.save(order);
        tempUser.get().getOrderIds().add(order.getOrderId());
        userRepository.save(tempUser.get());
        this.sendOrderEmail(tempUser.get(),order);
        return order;
    }

    public Order handleOrderFromItem(OrderRequestForItem orderRequestForItem) throws MessagingException, UnsupportedEncodingException {
        // The client will send the userid, productId, quantity
        double totalPrice = 0.0;
        Order order = new Order();
        Long productId = orderRequestForItem.getProductId();
        Long userId = orderRequestForItem.getCreatorId();
        User tempUser = userRepository.getReferenceById(userId);
        int quantity = orderRequestForItem.getQuantity();
        Product tempProduct = productService.getProduct(productId);
        if(tempProduct == null)
        {
            return null;
        }
        if(tempProduct.getTotalStock() <= 0)
        {
            throw new OutOfItemException("Sorry but this item is no longer in stock.");
        }
        order.setCreatorId(userId);
        order.getProductNames().add(tempProduct.getName());
        order.getProductImages().add(tempProduct.getImageUrl());
        order.getProductPrices().add(tempProduct.getPrice());
        if(quantity > tempProduct.getTotalStock())
        {
            order.getQuantity().add(tempProduct.getTotalStock());
        }
        else
        {
            order.getQuantity().add(quantity);
        }
        if(tempProduct.getTotalStock() == 0)
        {
            productService.deleteProduct(productId);
        }
        tempProduct.setTotalStock(tempProduct.getTotalStock() - quantity);
        productRepository.save(tempProduct);
        totalPrice += (tempProduct.getPrice() * quantity);
        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
        tempUser.getOrderIds().add(order.getOrderId());
        userRepository.save(tempUser);
        this.sendOrderEmail(tempUser,order);
        return order;
    }

    public Optional<Order> getOrderById(UUID orderId)
    {
        return orderRepository.findByOrderId(orderId);
    }

    public Iterable<Order> getOrdersFromUser(Long userId)
    {

        return orderRepository.findByCreatorId(userId);
    }

    public void sendOrderEmail(User user, Order order) throws MessagingException, UnsupportedEncodingException {
        DecimalFormat formatter = new DecimalFormat("#,###.00");
        String subject = user.getFirstName() + ", Thanks for your order";
        String senderName = "Webstore Application Test Service";
        String mailContent = "<p> Hello "+ user.getFirstName()+ ", </p>"+
                "<p>Order " + order.getOrderId() + " has been registered, we'll be working on it as soon as possible. </p> " +
                "<p> You purchased the following items " + order.getProductNames() + ".</p>"+
                "<p> The total price is $" + formatter.format(order.getTotalPrice()) + ". </p> " +
                "<p> You can expect to receive this by " + order.getArrivalDate()  +". </p> " +
                "<p> Thank you, <br> Webstore Application Test Service.";
        MimeMessage message = mailSender.createMimeMessage();
        var messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom(EmailUser, senderName);
        messageHelper.setTo(user.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        mailSender.send(message);
    }
}
