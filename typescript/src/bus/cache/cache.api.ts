/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

import { MessageFunction } from '../message.model';
import { Subscription } from 'rxjs/Subscription';
import { UUID } from './cache.model';

/**
 * CacheStream wraps an Observable, allowing for future underlying logic manipulation without
 * worrying about breaking API's.
 */
export interface CacheStream<T, E = any> {
    /**
     * Subscribe to Observable stream.
     * @param {MessageFunction<T>} successHandler function to handle ticks on stream
     * @param {MessageFunction<E>} errorHandler function to handle any internal failures.
     * @returns {Subscription} subscription to stream.
     */
    subscribe(successHandler: MessageFunction<T>, errorHandler?: MessageFunction<E>): Subscription;

    /**
     * Unsubscribe from Observable stream.
     */
    unsubscribe(): void;
}


/**
 * MutateStream allows mutating services to send back success or failure events to requesting actors.
 */
export interface MutateStream<T = any, E = any, S = any> extends CacheStream<T, E> {

    /**
     * Something went wrong with mutation
     * @param {E} error value to pass back to the mutator
     */
    error(error: E): void;

    /**
     * The mutation was a success!
     * @param {S} success value to pass back to mutator
     */
    success(success: S): void;
}

/**
 * BusCache is a stateful in memory cache for objects. All state changes (any time the cache is modified)
 * will broadcast that updated object to any subscribers of the BusCache listening for those specific objects
 * or all objects of a certain type and state changes.
 */
export interface BusCache<T> {

    /**
     * Place an object into the cache, will broadcast to all subscribers listening for state changes.
     * @param {UUID} id string ID of your object, UUID is highly recommended.
     * @param {T} value the object you wish to cache
     * @param {S} state the state change event you want to broadcast with this action (created, updated etc).
     */
    encache<T, S>(id: UUID, value: T, state: S): void;

    /**
     * Retrieve an object from the cache
     * @param {UUID} id the string ID of the object you wish to retrieve.
     * @returns {T} the object you're looking for.
     */
    retrieve<T>(id: UUID): T;

    /**
     * Get all values from cache.
     * @returns {Array<T>} everything we got!
     */
    allValues(): Array<T>;

    /**
     * Get the entire cache as a map.
     * @returns {Map<UUID, T>}
     */
    allValuesAsMap<T>(): Map<UUID, T>;

    /**
     * Remove/delete an object into the cache.
     * @param {UUID} id The string ID of the object you wish to remove.
     * @param {S} state you want to be sent to subscribers notifying cache deletion.
     * @return {boolean} true if it was removed, false if not.
     */
    remove<S>(id: UUID,  state: S): boolean;

    /**
     * Send a mutation request to any subscribers handling mutations.
     * @param {T} value to be mutated
     * @param {M} mutationType the type of the mutation
     * @param {MessageFunction<S>} successHandler provide object S to mutator function on successful mutation.
     * @param {MessageFunction<E>} errorHandler provide object E to mutator function on error.
     * @returns {boolean} true if mutation request was placed in stream
     */
    mutate<T, M, E, S>(value: T, mutationType: M,
                    successHandler: MessageFunction<S>, errorHandler?: MessageFunction<E>): boolean;

    /**
     * Populate the cache with a collection of objects and their ID's.
     * @param {Map<UUID, T>} items a Map of your UUID's mapped to your Objects.
     * @returns {boolean} if the cache has already been populated (has objects), will return false.
     */
    populate<T>(items: Map<UUID, T>): boolean;

    /**
     * Subscribe to state changes for a specific object.
     * @param {UUID} id the ID of the object you wish to receive updates.
     * @param {S} stateChangeType the state change type you wish to listen to
     * @returns {CacheStream<T>} stream that will tick the object you're listening for.
     */
    onChange<S, T>(id: UUID, ...stateChangeType: S[]): CacheStream<T>;

    /**
     * Subscribe to state changes for all objects of a specific type and state change
     * @param {T} typeInstance the type of object you're looking to listen for, needs to be an actual object however
     *            the method will look at the properties of the objects and match them to see if they are the same
     *            type. object can be a new empty instance of the type you want to watch, or an exisiting instance of
     *            something. The actual property values of the supplied object are ignored.
     * @param {S} stateChangeType the state change type you with to listen to
     * @returns {CacheStream<T>} stream that will tick the object you're listening for.
     */
    onAllChanges<S, T>(typeInstance: T, ...stateChangeType: S[]): CacheStream<T>;

    /**
     * Subscribe to mutation requests via mutate()
     * @param {T} objectType the object you want to listen for.
     * @param {M} mutationType optional mutation type
     * @returns {CacheStream<T>} stream that will tick mutation requests you're listening for.
     */
    onMutationRequest<T, M = any>(objectType: T, ...mutationType: M[]): MutateStream<T>;

    /**
     * Notify when the cache has been initialized (via populate() or initialized()
     * @param {MessageFunction<boolean>} readyFunction
     */
    whenReady(readyFunction: MessageFunction<boolean>): void;

    /**
     * Flip an internal bit to set the cache to ready, notify all watchers.
     */
    initialized(): void;

    /**
     * Will wipe all data out, in case you need a clean slate.
     */
    reset(): void;
}