package com.vmware.bifrost.bus.model;

import com.vmware.bifrost.bus.model.Channel;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class ChannelTest {

    private Channel channel;

    @Before
    public void setChannel() {
        channel = new Channel("test-channel");
    }

    @Test
    public void verifyStreamCreation() {
        channel.decrement();
        channel.decrement();

        Assert.assertEquals("test-channel", channel.getName());
        Assert.assertEquals(new Integer(0), channel.getRefCount());

        channel.setGalatic();

        Assert.assertTrue(channel.isGalactic());

        channel.setPrivate();

        Assert.assertFalse(channel.isGalactic());

        channel.complete();
        Assert.assertTrue(channel.getStreamObject().hasComplete());
        Assert.assertTrue(channel.isClosed());


    }

}